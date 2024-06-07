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
exports.FileService = void 0;
const fileio_1 = require("src/utils/fileio");
const core = __importStar(require("@actions/core"));
const fs = __importStar(require("fs"));
class FileService {
    async zipFilesFromWorkspace(workspace, zipPath, includeFileExtensions) {
        new Promise(async (resolve, reject) => {
            core.info(` Identifying IaC files in workspace: ${workspace}`);
            try {
                let isDirectory = (0, fileio_1.checkIfPathIsValidDirectory)(workspace);
                if (!isDirectory) {
                    core.info("Error: workspace path is not a directory");
                }
                (0, fileio_1.zipFilesFromPath)(workspace, zipPath, includeFileExtensions);
                resolve(true);
            }
            catch (error) {
                core.info(`Error compressing files for scan: ${error}`);
                reject(JSON.stringify(error));
            }
        });
    }
    async getInfraFilesFromDirectory(locationPath, zipFileList) {
        const dir = await fs.promises.opendir(locationPath);
        for await (const dirent of dir) {
            const joinedPath = `${locationPath}/${dirent.name}`;
            if ((0, fileio_1.checkIfPathIsValidDirectory)(joinedPath)) {
                if (dirent.name !== ".github" && dirent.name !== ".git") {
                    await this.getInfraFilesFromDirectory(joinedPath, zipFileList);
                }
            }
            else {
                if ((0, fileio_1.isValidIaCFileType)(joinedPath))
                    zipFileList.push(joinedPath);
            }
        }
        return zipFileList;
    }
}
exports.FileService = FileService;
//# sourceMappingURL=fileService.js.map