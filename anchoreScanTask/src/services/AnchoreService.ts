import * as cp from "child_process";
import { GetImageResult } from "../models/GetImageResult";

export class AnchoreService {
  readonly username: string;
  readonly password: string;
  readonly anchoreUrl: string;

  constructor(pUsername: string, pPassword: string, pAnchoreUrl: string) {
    this.username = pUsername;
    this.password = pPassword;
    this.anchoreUrl = pAnchoreUrl;
  }

  addImage(imageRequest: string | undefined): boolean {
    cp.execSync(`anchore-cli --u ${this.username} --p ${this.password} --url ${this.anchoreUrl} image add ${imageRequest}`);
    return true;
  }

  getImageDetailsResults(imageRequest: string): GetImageResult {
    const buffer: Buffer = cp.execSync(`anchore-cli --json --u ${this.username} --p ${this.password} --url ${this.anchoreUrl} image get ${imageRequest}`);
    const jsonObject = buffer.toString();
    var array = <GetImageResult[]>JSON.parse(jsonObject);

    return array[0];
  }

  getAllImageVulnResults(imageRequest: string | undefined): string {
    var buffer: Buffer = cp.execSync(`anchore-cli --json --u ${this.username} --p ${this.password} --url ${this.anchoreUrl} image vuln ${imageRequest} all`);
    return buffer.toString();
  }

  getPolicyEvaluateResult(imageRequest: string | undefined): string {
    // special note: anchore-cli will fail as a process when the policy scan fails. This doesnt manifest at the command
    // line but it will happen here. So we want to check that we do not have an error before proceeding
    try {
      var buffer: Buffer = cp.execSync(`anchore-cli --u ${this.username} --p ${this.password} --url ${this.anchoreUrl} evaluate check ${imageRequest}`);
      return buffer.toString();
    }
    catch (err) {
      if (err.stderr != null && err.stderr.toString().length > 0) {
        console.log(`'${err.stderr.toString()}'`);
        throw err;
      }

      return err.output[1].toString();
    }
  }
}
