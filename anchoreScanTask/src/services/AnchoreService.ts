import * as cp from "child_process";
import { GetImageResult } from "../models/GetImageResult";
import { VulnScanItem, VulnScanRoot } from "../models/VulnerabilityScanItemResult";
import { PolicyCheckResult } from "../models/PolicyCheckResult";

export class AnchoreService {
  readonly username: string;
  readonly password: string;
  readonly anchoreUrl: string;

  constructor(pUsername: string, pPassword: string, pAnchoreUrl: string) {
    this.username = pUsername;
    this.password = pPassword;
    this.anchoreUrl = pAnchoreUrl;
  }

  addImage(imageRequest: string): boolean {
    cp.execSync(`anchore-cli --u ${this.username} --p ${this.password} --url ${this.anchoreUrl} image add ${imageRequest}`);
    return true;
  }

  getImageDetailsResults(imageRequest: string): GetImageResult {
    const buffer: Buffer = cp.execSync(`anchore-cli --json --u ${this.username} --p ${this.password} --url ${this.anchoreUrl} image get ${imageRequest}`);
    const jsonObject = JSON.parse(buffer.toString());
    var array = <GetImageResult[]>jsonObject;

    return array[0];
  }

  getAllImageVulnerabilities(imageRequest: string): VulnScanItem[] {
    const buffer: Buffer = cp.execSync(`anchore-cli --json --u ${this.username} --p ${this.password} --url ${this.anchoreUrl} image vuln ${imageRequest} all`);
    const jsonObject = JSON.parse(buffer.toString());

    return (<VulnScanRoot>jsonObject).vulnerabilities;
  }

  getPolicyEvaluateResult(imageRequest: string): PolicyCheckResult {
    // special note: anchore-cli will fail as a process when the policy scan fails. This doesnt manifest at the command
    // line but it will happen here. So we want to check that we do not have an error before proceeding
    try {
      var buffer: Buffer = cp.execSync(`anchore-cli --json --u ${this.username} --p ${this.password} --url ${this.anchoreUrl} evaluate check ${imageRequest}`);
      return this.getPolicyCheckResult(buffer.toString(), imageRequest);
    }
    catch (err) {
      if (err.stderr != null && err.stderr.toString().length > 0) {
        console.log(`'${err.stderr.toString()}'`);
        throw err;
      }

      return this.getPolicyCheckResult(err.output[1].toString(), imageRequest);
    }
  }

  private getPolicyCheckResult(evaluateRawOutput: string, imageName: string): PolicyCheckResult {
    const jsonObject = JSON.parse(evaluateRawOutput);
    const foundObject = this.findKey(jsonObject, imageName);
    if (foundObject == null)
      throw new Error("Could not find target image is policy evaluate response");

    return foundObject[0] as PolicyCheckResult;
  }

  private findKey(object: any, searchString: string): any {
    for (const key of Object.keys(object))
    {
      if (key.indexOf(searchString) >= 0) {
        return object[key];
      }

      return this.findKey(object[key], searchString);
    }

    return null;
  }
}
