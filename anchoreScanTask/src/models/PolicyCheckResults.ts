import { PolicyCheckStatus } from "../enum";

export class PolicyCheckResults {
    constructor(private rawStringResults: string) {
    }

    get status(): PolicyCheckStatus {
        var matches = this.rawStringResults.match(/Status: (\w+)\W+/);
        if (matches && matches.length > 2) {
            const typedStatusString = matches[1] as keyof typeof PolicyCheckStatus;
            return PolicyCheckStatus[typedStatusString];
        }

        throw new Error("No status found in Policy Evaluate Response");
    }
}