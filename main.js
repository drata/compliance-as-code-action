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
exports.run = void 0;
const core = __importStar(require("@actions/core"));
const configuration_1 = require("./utils/configuration");
const actionService_1 = require("./services/actionService");
const uuid_1 = require("uuid");
async function run() {
    try {
        let config = new configuration_1.Configuration();
        let status = config.checkIfActionIsConfiguredCorrectly();
        if (!status.isValid) {
            core.setFailed(status.message);
        }
        core.info(` Running action on repository: ${process.env.GITHUB_REPOSITORY} for branch ${process.env.GITHUB_REF_NAME}`);
        if (config.configParams?.apiKey === "undefined") {
            core.info("Api key is undefined " + config.configParams.apiKey.substring(0, 4));
        }
        const pipelineInfo = getPipelineMetadata(config);
        const action = new actionService_1.ActionService(config.configParams);
        const response = await (await action.prepare()).queueValidation(pipelineInfo);
        let results = await action.checkIfResultsAreAvailable(config.configParams.timeoutSeconds, pipelineInfo.runId);
        let actionResult = action.publishResults(config.configParams?.maxSeverity || "", results);
        if (actionResult == false) {
            core.setFailed(`Drata Compliance as Code action failed. There are issues found with severity:${config.configParams?.maxSeverity}`);
        }
        else {
            core.info("Drata Compliance as Code passed with issues found.");
        }
    }
    catch (error) {
        core.setFailed(error?.message ?? error);
    }
}
exports.run = run;
function getPipelineMetadata(config) {
    let runId = (0, uuid_1.v4)();
    let repoPath = process.env.GITHUB_REPOSITORY ?? "";
    let repoTokens = repoPath.split("/");
    let repoName = repoTokens[repoTokens.length - 1];
    let sourceBranch = process.env.GITHUB_REF_NAME ?? "";
    let repoRef = process.env.GITHUB_REF || "";
    let triggerRefTokens = repoRef.split("/");
    let trigger = triggerRefTokens[1];
    let pipelineInfo = {
        branchName: sourceBranch,
        repositoryName: repoName,
        repositoryId: process.env.GITHUB_REPOSITORY_ID || "",
        commitHash: process.env.GITHUB_SHA ?? "",
        repositoryOwner: process.env.GITHUB_REPOSITORY_OWNER ?? "",
        runId: runId,
        vendorRunId: process.env.GITHUB_RUN_ID || "",
        sourceBranchName: sourceBranch,
        destinationBranchName: process.env.GITHUB_BASE_REF || sourceBranch,
        runInitiatedBy: process.env.GITHUB_ACTOR || "",
        trigger: trigger,
        minimumSeverity: config.configParams?.maxSeverity || "",
    };
    return pipelineInfo;
}
//# sourceMappingURL=main.js.map