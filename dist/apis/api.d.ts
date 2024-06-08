import { ActionConfig } from "src/models/actionConfig";
import { IacUploadDetails } from "src/apis/models/iacUploadDetails";
import { PostPipelinesScanRequest } from "./models/postPipelineScanRequest";
import { PipelineResults } from "./models/pipelineResults";
export declare class Api {
    private ApiBaseUrl;
    private config;
    constructor(actionConfig: ActionConfig);
    getClientUploadStorageDetails(): Promise<IacUploadDetails>;
    uploadIaCToS3(uploadRequest: IacUploadDetails): Promise<void>;
    postIaCScanValidation(iacScanRequest: PostPipelinesScanRequest): Promise<any>;
    checkForResults(runId: string): Promise<PipelineResults>;
    private buildApiUrl;
}
