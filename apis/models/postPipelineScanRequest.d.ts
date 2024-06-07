export interface PostPipelinesScanRequest {
    runId: string;
    repositoryName: string;
    repositoryOwner: string;
    repositoryId: string;
    branchName: string;
    sourceBranchName: string;
    destinationBranchName: string;
    vendorRunId: string;
    trigger: string;
    commitHash: string;
    minimumSeverity: string;
    runInitiatedBy: string;
}
