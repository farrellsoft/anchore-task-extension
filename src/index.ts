import task = require("azure-pipelines-task-lib/task");
import commandExists from "command-exists";
import { AnchoreService } from "./AnchoreService";

import analyze_image from './AnalyzeImage';
import { TaskInput } from "./TaskInput";
import { VulnScan } from "./VulnScan";

async function run() {
  var input: TaskInput = new TaskInput();
  
  // does anchor-cli exist
  var exists = commandExists.sync("anchore-cli");
  if (!exists) {
    task.setResult(task.TaskResult.Failed, "anchore-cli is not installed");
    return;
  }

  var service = new AnchoreService(
    input.getEngineUser(),
    input.getEnginePassword(),
    input.getEngineUrl()
  );

  try {
    // add the image to anchore engine
    service.addImage(input.getImageName());

    // analyze the image
    var imageAnalyzed: boolean = analyze_image(service, input.getImageName())
    if (!imageAnalyzed) {
      task.setResult(task.TaskResult.Failed, "Image failed to be analyzed");
      return;
    }

    if (input.getExecuteVulnScan()) {
      var vulnScan: VulnScan = new VulnScan(input, service);
      vulnScan.executeScan();
    }

    console.log("Image analysis successful");
  }
  catch (err) {
    task.setResult(task.TaskResult.Failed, err);
  }

  console.log("run completed");
}

run();
