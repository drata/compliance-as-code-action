import { Api } from "@src/apis/api";
import { ActionConfig } from "src/models/actionConfig";
import { PipelineResults } from "@src/apis/models/pipelineResults";
import { PipelineInfo } from "../models/pipelineInfo";
export declare class ActionService {
    private configParams;
    private runRequestId;
    private includeFileExtensions;
    api: Api;
    sleep: (ms: number) => Promise<unknown>;
    constructor(configParams: ActionConfig);
    prepare(): Promise<void>;
    queueValidation(pipelineInfo: PipelineInfo): Promise<{
        pipelineId: number;
    }>;
    checkIfResultsAreAvailable(timeoutInSeconds: number, runId: string): Promise<PipelineResults>;
    publishResults(maxSeverity: string, results: PipelineResults): boolean;
    buildPlatformLink(runId: string, pipelineId: number): string | null;
}
