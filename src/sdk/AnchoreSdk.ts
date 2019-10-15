import * as cp from "child_process";

export class AnchoreSdk {
  readonly username: string;
  readonly password: string;
  readonly anchoreUrl: string;

  constructor(
    pUsername: string | undefined,
    pPassword: string | undefined,
    pAnchoreUrl: string | undefined
  ) {
    if (pUsername == undefined)
      throw new Error("Username is not defined for Anchore API calls");
    this.username = pUsername;

    if (pPassword == undefined)
      throw new Error("Password is not defined for the Anchor API calls");
    this.password = pPassword;

    if (pAnchoreUrl == undefined)
      throw new Error("Anchore Url is not defined for the Anchor API calls");
    this.anchoreUrl = pAnchoreUrl;
  }

  addImage(imageRequest: string | undefined): boolean {
    if (imageRequest == undefined)
      throw new Error("Image Request cannot be empty - please specify an image to add");

    cp.execSync(`anchore-cli --u ${this.username} --p ${this.password} --url ${this.anchoreUrl} image add ${imageRequest}`);
    return true;
  }

  getImageDetailsCommandString(imageRequest: string | undefined): string {
    if (imageRequest == undefined)
      throw new Error("Image Request cannot be empty - please specify an image to get details for");

    var buffer: Buffer = cp.execSync(`anchore-cli --u ${this.username} --p ${this.password} --url ${this.anchoreUrl} image get ${imageRequest}`);
    return buffer.toString();
  }
}
