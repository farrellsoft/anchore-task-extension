
import task = require("azure-pipelines-task-lib");

export class TaskInput {
  getEngineUrl(): string {
    const anchoreUrl: string | undefined = task.getInput(
      "engineUrl",
      true
    );

    if (anchoreUrl === undefined || anchoreUrl.length === 0)
      throw new Error("EngineUrl is a required parameter that must have a value");
    return anchoreUrl;
  }

  getEngineUser(): string {
    const engineUser: string | undefined = task.getInput(
      "engineUser",
      true
    );
    
    if (engineUser === undefined || engineUser.length === 0)
      throw new Error("EngineUser is a required parameter that must have a value");
    return engineUser;
  }

  getEnginePassword(): string {
    const enginePassword: string | undefined = task.getInput(
      "enginePassword",
      true
    );

    if (enginePassword === undefined || enginePassword.length === 0)
      throw new Error("EnginePassword is a required parameter that must have a value");
    return enginePassword;
  }

  getImageName(): string {
    const anchoreImage: string | undefined = task.getInput("imageName", true);
    if (anchoreImage === undefined || anchoreImage.length === 0)
      throw new Error("An image name for analysis must be provided");

      return anchoreImage;
  }

  getExecuteVulnScan(): boolean {
    const executeVulnScan: boolean | undefined = task.getBoolInput("doVulnScan", false);
    if (executeVulnScan === undefined)
      return false;

    return executeVulnScan;
  }

  getMinimumHighCount(): number {
    const minAllowedRaw: string | undefined = task.getInput("minHighAllowed", false);
    if (minAllowedRaw === undefined)
      return -1;

    var parsedValue = Number(minAllowedRaw);
    if (parsedValue === NaN)
      throw new Error("The given value for Min High Vulnerability allowed is not a number");
    
    return parsedValue;
  }

  getMinimumMediumCount(): number {
    const minAllowedRaw: string | undefined = task.getInput("minMedAllowed", false);
    if (minAllowedRaw === undefined)
      return -1;

    var parsedValue = Number(minAllowedRaw);
    if (parsedValue === NaN)
      throw new Error("The given value for Min Med Vulnerability allowed is not a number");

    return parsedValue;
  }

  getMinimumLowCount(): number {
    const minAllowedRaw: string | undefined = task.getInput("minLowAllowed", false);
    if (minAllowedRaw === undefined)
      return -1;

    var parsedValue = Number(minAllowedRaw);
    if (parsedValue === NaN)
      throw new Error("The given value for Min Low Vulnerability allowed is not a number");

    return parsedValue;
  }

  getMinimumNegligibleCount(): number {
    const minAllowedRaw: string | undefined = task.getInput("minNegAllowed", false);
    if (minAllowedRaw === undefined)
      return -1;

    var parsedValue = Number(minAllowedRaw);
    if (parsedValue === NaN)
      throw new Error("The given value for Min Negligible Vulnerability allowed is not a number");

    return parsedValue;
  }
}