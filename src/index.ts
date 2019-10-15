import task = require("azure-pipelines-task-lib/task");
import commandExists from "command-exists";
import { AnchoreService } from "./services/AnchoreService";

import analyze_image from './analyze_image';
import { TaskInput } from "./TaskInput";

async function run() {
  var input: TaskInput = new TaskInput();
  var executeVulnScan: boolean = task.getBoolInput("doVulnScan", false);
  if (executeVulnScan === undefined) { executeVulnScan = false; }

  // does anchor-cli exist
  var exists = commandExists.sync("anchore-cli");
  if (!exists) {
    task.setResult(task.TaskResult.Failed, "anchore-cli is not installed");
    return;
  }

  var sdk = new AnchoreService(
    input.getEngineUser(),
    input.getEnginePassword(),
    input.getEngineUrl()
  );

  try {
    // add the image to anchore engine
    sdk.addImage(input.getImageName());

    // analyze the image
    var imageAnalyzed: boolean = analyze_image(sdk, input.getImageName())
    if (!imageAnalyzed) {
      task.setResult(task.TaskResult.Failed, "Image failed to be analyzed");
      return;
    }

    console.log("Image analysis successful");
  }
  catch (err) {
    task.setResult(task.TaskResult.Failed, err);
  }

  console.log("run completed");
}

run();
