import { DesignGap } from "./designGap";
export interface PipelineResults {
    designGaps: DesignGap[];
    excludedFindings: DesignGap[];
}
