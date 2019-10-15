import task = require("azure-pipelines-task-lib/task");
import commandExists from "command-exists";
import { AnchoreSdk } from "./sdk/AnchoreSdk";

import analyze_image from './analyze_image';

async function run() {
  const anchoreUrl: string | undefined = task.getInput(
    "anchoreEngineUrl",
    true
  );
  const anchoreUser: string | undefined = task.getInput(
    "anchoreEngineUser",
    true
  );
  const anchorePassword: string | undefined = task.getInput(
    "anchoreEnginePassword",
    true
  );
  const anchoreImage: string | undefined = task.getInput("anchoreImage", true);

  // does anchor-cli exist
  var exists = commandExists.sync("anchore-cli");
  if (!exists) {
    task.setResult(task.TaskResult.Failed, "anchore-cli is not installed");
    return;
  }

  var sdk = new AnchoreSdk(
    anchoreUser,
    anchorePassword,
    anchoreUrl
  );

  try {
    // add the image to anchore engine
    sdk.addImage(anchoreImage);

    // analyze the image
    var imageAnalyzed: boolean = analyze_image(sdk, anchoreImage)
    if (!imageAnalyzed) {
      task.setResult(task.TaskResult.Failed, "Image failed to be analyzed");
      return;
    }

    task.setResult(task.TaskResult.Succeeded, "Image analysis successful");
  }
  catch (err) {
    task.setResult(task.TaskResult.Failed, err);
  }

  console.log("run completed");
}

run();
