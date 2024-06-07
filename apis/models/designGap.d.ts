import { ResourceMetadata } from "./resourceMetadata";
export interface DesignGap {
    configId: string;
    currentValue: string;
    description: string;
    documentationUrl: string;
    fix: string;
    fileName: string;
    lineNumber: string;
    preferredValue: string;
    resourceMetadata: ResourceMetadata;
    severity: number;
    testId: string;
    pullRequestUrl: string;
}
