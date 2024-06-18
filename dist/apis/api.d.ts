import { ActionConfig } from "src/models/actionConfig";
import { IacUploadDetails } from "src/apis/models/iacUploadDetails";
import { PostPipelinesScanRequest } from "./models/postPipelineScanRequest";
import { PipelineResultResponse } from "./models/pipelineResultResponse";
export declare class Api {
    private ApiBaseUrl;
    private config;
    constructor(actionConfig: ActionConfig);
    getClientUploadStorageDetails(): Promise<IacUploadDetails>;
    uploadIaCToS3(uploadRequest: IacUploadDetails): Promise<void>;
    postIaCScanValidation(iacScanRequest: PostPipelinesScanRequest): Promise<{
        pipelineId: number;
    }>;
    checkForResults(runId: string): Promise<PipelineResultResponse>;
    private buildApiUrl;
}
