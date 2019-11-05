import * as cp from "child_process";

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

  getImageDetailsResults(imageRequest: string | undefined): string {
    var buffer: Buffer = cp.execSync(`anchore-cli --u ${this.username} --p ${this.password} --url ${this.anchoreUrl} image get ${imageRequest}`);
    return buffer.toString();
  }

  getAllImageVulnResults(imageRequest: string | undefined): string {
    var buffer: Buffer = cp.execSync(`anchore-cli --json --u ${this.username} --p ${this.password} --url ${this.anchoreUrl} image vuln ${imageRequest} all`);
    return buffer.toString();
  }

  getPolicyEvaluateResults(imageRequest: string | undefined): string {
    var buffer: Buffer = cp.execSync(`anchore-cli --u ${this.username} --p ${this.password} --url ${this.anchoreUrl} evaluate check ${imageRequest}`);
    return buffer.toString();
  }
}
