import { ActionConfig } from "@src/models/actionConfig";
import { ConfigurationStatus } from "@src/models/configurationStatus";
export declare class Configuration {
    configParams: ActionConfig | undefined;
    constructor();
    checkIfActionIsConfiguredCorrectly(): ConfigurationStatus;
}
