"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionService = void 0;
const api_1 = require("@src/apis/api");
const fileService_1 = require("./fileService");
const core = __importStar(require("@actions/core"));
class ActionService {
    configParams;
    runRequestId = "";
    includeFileExtensions = ".*.(tf|tfvar|terraform|tf.json|json|yaml|yml)";
    api;
    sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    constructor(configParams) {
        this.api = new api_1.Api(configParams);
    }
    async prepare() {
        let response = await this.api?.getClientUploadStorageDetails();
        core.info(JSON.stringify(response));
        if (response != null || response != undefined) {
            let fileService = new fileService_1.FileService();
            await fileService.zipFilesFromWorkspace(process.env.GITHUB_WORKSPACE || "", response.zipName, this.includeFileExtensions);
            let uploadResponse = await this.api?.uploadIaCToS3(response);
            core.info("Files uploaded.");
            core.info(`${uploadResponse}`);
        }
        return this;
    }
    async queueValidation(pipelineInfo) {
        let iacPipelineScanRequest = {
            branchName: pipelineInfo.branchName,
            sourceBranchName: pipelineInfo.sourceBranchName,
            destinationBranchName: pipelineInfo.destinationBranchName,
            commitHash: pipelineInfo.commitHash,
            repositoryName: pipelineInfo.repositoryName,
            repositoryOwner: pipelineInfo.repositoryOwner,
            repositoryId: pipelineInfo.repositoryId,
            runId: pipelineInfo.runId,
            vendorRunId: pipelineInfo.vendorRunId,
            trigger: pipelineInfo.trigger,
            minimumSeverity: pipelineInfo.minimumSeverity,
            runInitiatedBy: pipelineInfo.runInitiatedBy,
        };
        return await this.api?.postIaCScanValidation(iacPipelineScanRequest);
    }
    async checkIfResultsAreAvailable(timeoutInSeconds, runId) {
        let results = { designGaps: [] };
        let retries = timeoutInSeconds / 5;
        core.info(`Waiting for results with ${retries} retries...`);
        for (let retry = 0; retry < retries; retry++) {
            core.info(` Retry ${retry + 1}: Checking for results...`);
            await this.sleep(5000);
            results = await this.api?.checkForResults(runId);
            if (results.designGaps?.length != 0) {
                break;
            }
        }
        return results;
    }
    publishResults(maxSeverity, results) {
        let severityThreshold = 0;
        let severityMap = ["None", "Low", "Moderate", "High", "Critical"];
        if (maxSeverity.toLowerCase() == "critical") {
            severityThreshold = 4;
        }
        else if (maxSeverity.toLowerCase() == "high") {
            severityThreshold = 3;
        }
        else if (maxSeverity.toLowerCase() == "moderate") {
            severityThreshold = 2;
        }
        else if (maxSeverity.toLowerCase() == "low") {
            severityThreshold = 1;
        }
        let grouped = results.designGaps.reduce((result, currentValue) => {
            (result[severityMap[currentValue.severity]] =
                result[severityMap[currentValue.severity]] || []).push(currentValue);
            return result;
        }, {});
        core.info("------------------------------------------------------------------");
        core.info(` \u001B[31mCritical: ${grouped["Critical"]?.length ?? 0} High: ${grouped["High"]?.length ?? 0} Moderate: ${grouped["Moderate"]?.length ?? 0} Low: ${grouped["Low"]?.length ?? 0} `);
        core.info("------------------------------------------------------------------");
        let actionResult = true;
        if (severityThreshold != 0) {
            severityMap.forEach((_, index) => {
                if (index >= severityThreshold &&
                    grouped[severityMap[index] ?? 0]?.length > 0) {
                    actionResult = false;
                }
            });
        }
        return actionResult;
    }
}
exports.ActionService = ActionService;
//# sourceMappingURL=actionService.js.map