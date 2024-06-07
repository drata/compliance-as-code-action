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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Api = void 0;
const axios_1 = __importDefault(require("axios"));
const core = __importStar(require("@actions/core"));
const fs = require("fs");
class Api {
    ApiBaseUrl = "";
    config;
    constructor(actionConfig) {
        this.config = actionConfig;
        this.ApiBaseUrl = this.buildApiUrl(this.config.region.toLowerCase(), this.config.environment);
    }
    async getClientUploadStorageDetails() {
        core.info("Getting storage details");
        return new Promise((resolve, reject) => {
            let repositoryName = (process.env.GITHUB_REPOSITORY || "")
                .split("/")
                .pop();
            let url = `${this.ApiBaseUrl}/public/workspaces/${this.config?.workspaceId}/pipelines/iac-upload-details?repositoryName=${repositoryName}&repositoryOwner=${process.env.GITHUB_REPOSITORY_OWNER}&branchName=${process.env.GITHUB_REF_NAME}&commitHash=${process.env.GITHUB_SHA}`;
            let encodedUrl = encodeURI(url);
            let partial = this.config?.apiKey.substring(0, 4);
            axios_1.default
                .get(encodedUrl, {
                headers: {
                    Authorization: `Bearer ${this.config?.apiKey}`,
                },
            })
                .then((res) => {
                resolve(res.data);
            })
                .catch((error) => {
                if (error.response.status === 401) {
                    reject(`\u001B[31mThe api key is invalid or expired.`);
                }
                else {
                    reject(error);
                }
            });
        });
    }
    async uploadIaCToS3(uploadRequest) {
        try {
            const fileStream = fs.createReadStream(uploadRequest.zipName);
            const fileStats = fs.statSync(uploadRequest.zipName);
            let formData = new FormData();
            formData.append("terraform.zip", uploadRequest.zipName);
            return new Promise((resolve, reject) => {
                axios_1.default
                    .put(uploadRequest.presignedUrl, fileStream, {
                    headers: {
                        "Content-Type": "application/zip",
                        "Content-Length": `${fileStats.size.toString()}`,
                    },
                    maxRedirects: 0,
                    onUploadProgress: function (progressEvent) {
                        core.info(` File upload in progress...`);
                    },
                })
                    .then((res) => {
                    resolve(res.data);
                })
                    .catch((error) => {
                    if (error.response.status === 401 ||
                        error.response.status === 403) {
                        core.info(`\u001B[31mThe api key is invalid or expired.`);
                        resolve();
                    }
                    else {
                        reject(error);
                    }
                });
            });
        }
        catch (error) {
            console.error("Error uploading IaC files to Drata:", error);
        }
    }
    async postIaCScanValidation(iacScanRequest) {
        let url = `${this.ApiBaseUrl}/public/workspaces/${this.config?.workspaceId}/pipelines/iac-scan`;
        core.info(`Starting scan with id: ${iacScanRequest.runId}`);
        return new Promise((resolve, reject) => {
            axios_1.default
                .post(url, iacScanRequest, {
                headers: {
                    Authorization: `Bearer ${this.config?.apiKey}`,
                    "Content-Type": "application/json",
                },
            })
                .then((res) => {
                resolve(res.data);
            })
                .catch((error) => {
                if (error.response.status === 401 || error.response.status === 403) {
                    core.info(`\u001B[31mThe api key is invalid or expired.`);
                    resolve({});
                }
                else {
                    reject(error);
                }
            });
        });
    }
    async checkForResults(runId) {
        let url = `${this.ApiBaseUrl}/public/workspaces/${this.config?.workspaceId}/pipelines/results?runId=${runId}`;
        return new Promise((resolve, reject) => {
            axios_1.default
                .get(url, {
                headers: {
                    Authorization: `Bearer ${this.config?.apiKey}`,
                    "Content-Type": "application/json",
                },
            })
                .then((res) => {
                resolve(res.data);
            })
                .catch((error) => {
                core.info(error);
                if (error.response.status === 404) {
                    resolve({ designGaps: [] });
                }
                else {
                    reject(error);
                }
            });
        });
    }
    buildApiUrl(region, environment) {
        let environmentMap = new Map();
        environmentMap.set("app-04", "public-api-04.dev");
        environmentMap.set("production", "public-api");
        environmentMap.set("qa", "public-api.qa");
        if (region === "eu") {
            return `https://${environmentMap.get(environment)}.eu.drata.com`;
        }
        return `https://${environmentMap.get(environment)}.drata.com`;
    }
}
exports.Api = Api;
//# sourceMappingURL=api.js.map