import { PolicyCheckStatus } from "../enum";

export class PolicyCheckResult {
    constructor(private rawStringResults: string) {
        console.log('ctx');
        console.log(this.rawStringResults);
    }

    get status(): PolicyCheckStatus {
        var matches = this.rawStringResults.match(/Status: (\w+)\W+/);
        if (matches && matches.length > 1) {
            return matches[1] as PolicyCheckStatus;
        }

        throw new Error("No status found in Policy Evaluate Response");
    }

    get fulltag(): string {
        var matches = this.rawStringResults.match(/Full Tag: (\w+)\W+/);
        if (matches && matches.length > 1) {
            return matches[1];
        }

        throw new Error("No Full Tag value found");
    }
}