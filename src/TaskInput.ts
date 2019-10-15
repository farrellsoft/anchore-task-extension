
import task = require("azure-pipelines-task-lib/task");

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

  getEngineUser() {
    const engineUser: string | undefined = task.getInput(
      "engineUser",
      true
    );
    
    if (engineUser === undefined || engineUser.length === 0)
      throw new Error("EngineUser is a required parameter that must have a value");
    return engineUser;
  }

  getEnginePassword() {
    const enginePassword: string | undefined = task.getInput(
      "enginePassword",
      true
    );

    if (enginePassword === undefined || enginePassword.length === 0)
      throw new Error("EnginePassword is a required parameter that must have a value");
    return enginePassword;
  }

  getImageName() {
    const anchoreImage: string | undefined = task.getInput("imageName", true);
    if (anchoreImage === undefined || anchoreImage.length === 0)
      throw new Error("An image name for analysis must be provided");

      return anchoreImage;
  }
}