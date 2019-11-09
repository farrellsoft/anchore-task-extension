import shell from "shelljs";
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
    shell.exec(`anchore-cli --u ${this.username} --p ${this.password} --url ${this.anchoreUrl} image add ${imageRequest}`);
    return true;
  }

  getImageDetailsResults(imageRequest: string): GetImageResult {
    const bufferString: string = shell.exec(`anchore-cli --json --u ${this.username} --p ${this.password} --url ${this.anchoreUrl} image get ${imageRequest}`);
    const jsonObject = JSON.parse(bufferString);
    var array = <GetImageResult[]>jsonObject;

    return array[0];
  }

  getAllImageVulnerabilities(imageRequest: string): VulnScanItem[] {
    const bufferString: string = shell.exec(`anchore-cli --json --u ${this.username} --p ${this.password} --url ${this.anchoreUrl} image vuln ${imageRequest} all`);
    const jsonObject = JSON.parse(bufferString.toString());

    return (<VulnScanRoot>jsonObject).vulnerabilities;
  }

  getPolicyEvaluateResult(imageRequest: string): PolicyCheckResult {
    // special note: anchore-cli will fail as a process when the policy scan fails. This doesnt manifest at the command
    // line but it will happen here. So we want to check that we do not have an error before proceeding
    try {
      var bufferString: string = shell.exec(`anchore-cli --json --u ${this.username} --p ${this.password} --url ${this.anchoreUrl} evaluate check ${imageRequest}`);
      var jsonObject = JSON.parse(bufferString.toString());

      console.log("using main return area");
      return (<PolicyCheckResult[]>jsonObject)[0];
    }
    catch (err) {
      if (err.stderr != null && err.stderr.toString().length > 0) {
        console.log(`'${err.stderr.toString()}'`);
        throw err;
      }

      console.log(err);
      var jsonObject = JSON.parse(err.output[1].toString());
      return (<PolicyCheckResult[]>jsonObject)[0];
    }
  }
}
