import task = require("azure-pipelines-task-lib");
import commandExists from "command-exists";
import { AnchoreService } from "./AnchoreService";

import analyze_image from './AnalyzeImage';
import { TaskInput } from './TaskInput';
import { VulnScan } from './VulnScan';
import { VulnSeverity, PolicyCheckStatus } from './enum';
import { PolicyCheckResult } from "./models/PolicyCheckResult";

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
    var imageAnalyzed: boolean = await analyze_image(service, input.getImageName())
    if (!imageAnalyzed) {
      task.setResult(task.TaskResult.Failed, "Image failed to be analyzed");
      return;
    }

    if (input.getExecutePolicyScan()) {
      console.log("Performing Policy Scan");
      var rawResult = service.getPolicyEvaluateResult(input.getImageName());
      console.log('Policy Check Completed');
      var result = new PolicyCheckResult(rawResult);
      if (result.status == PolicyCheckStatus.FAIL) {
        task.setResult(task.TaskResult.Failed, 'Image Failed Policy Check');
        return;
      }
    }
    
    if (input.getExecuteVulnScan()) {
      console.log("Performing Vulnerability Checks");
      var vulnScan: VulnScan = new VulnScan(input, service);
      vulnScan.executeScan();

      const highCount: Number = vulnScan.getCount(VulnSeverity.HIGH);
      if (highCount > input.getMinimumHighCount() && input.getMinimumHighCount() >= 0) {
        task.setResult(task.TaskResult.Failed, "Scanned image has too many high vulnerabilities");
        return;
      }

      const mediumCount: Number = vulnScan.getCount(VulnSeverity.MEDIUM);
      if (mediumCount > input.getMinimumMediumCount() && input.getMinimumMediumCount() >= 0) {
        task.setResult(task.TaskResult.Failed, "Scanned image has too many medium vulnerabilities");
        return;
      }

      const lowCount: Number = vulnScan.getCount(VulnSeverity.LOW);
      if (lowCount > input.getMinimumLowCount() && input.getMinimumLowCount() >= 0) {
        task.setResult(task.TaskResult.Failed, "Scanned image has too many low vulnerabilities");
        return;
      }

      const negligibleCount: Number = vulnScan.getCount(VulnSeverity.NEGLIGIBLE);
      if (negligibleCount > input.getMinimumNegligibleCount() && input.getMinimumNegligibleCount() >= 0) {
        task.setResult(task.TaskResult.Failed, "Scanned image has too many neglibile vulnerabilities");
        return;
      }

      if (input.getVulnScanExportPath() !== "") {
        vulnScan.saveHtmlReport(input.getVulnScanExportPath());
      }
    }

    console.log("Image analysis successful");
  }
  catch (err) {
    task.setResult(task.TaskResult.Failed, 'Error Executing the Scan');
  }

  console.log("run completed");
}

run();
