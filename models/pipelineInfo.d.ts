export interface PipelineInfo {
    repositoryName: string;
    repositoryOwner: string;
    repositoryId: string;
    branchName: string;
    commitHash: string;
    runId: string;
    sourceBranchName: string;
    destinationBranchName: string;
    vendorRunId: string;
    trigger: string;
    runInitiatedBy: string;
    minimumSeverity: string;
}
