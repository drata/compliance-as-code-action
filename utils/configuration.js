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
exports.Configuration = void 0;
const core = __importStar(require("@actions/core"));
class Configuration {
    configParams;
    constructor() {
        this.configParams = {
            workspaceId: "1",
            verboseLogging: true,
            timeoutSeconds: 600,
            region: "US",
            maxSeverity: "Critical",
            apiKey: "",
            environment: "production",
        };
    }
    checkIfActionIsConfiguredCorrectly() {
        let status = { isValid: true, message: "Configuration is valid." };
        let env = process.env.DRATA_ENVIRONMENT || "production";
        core.info("Checking if the action is configured correctly.");
        const ms = core.getInput("minimumSeverity");
        const workspaceId = core.getInput("workspaceId");
        const logging = (core.getInput("verboseLogging") || "true") == "true";
        const region = core.getInput("region") || "US";
        const timeout = +(core.getInput("timeoutSeconds") || "600");
        if (!process.env.GITHUB_REPOSITORY ||
            !process.env.DRATA_API_TOKEN ||
            !workspaceId ||
            !region) {
            status.isValid = false;
            status.message =
                "Action is missing required configuration. Check to ensure that region and workspaceId are specified in the workflow.";
        }
        else {
            this.configParams = {
                workspaceId: workspaceId,
                verboseLogging: logging,
                timeoutSeconds: timeout,
                region: region,
                maxSeverity: ms,
                apiKey: process.env.DRATA_API_TOKEN,
                environment: env,
            };
        }
        return status;
    }
}
exports.Configuration = Configuration;
//# sourceMappingURL=configuration.js.map