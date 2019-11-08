import task = require("azure-pipelines-task-lib");
import commandExists from "command-exists";
import { AnchoreService } from "./services/AnchoreService";

import { TaskInput } from './TaskInput';
import { VulnSeverity, PolicyCheckStatus } from './enum';
import { AnalyzeImageService } from "./services/AnalyzeImageService";
import { VulnerabilityScanService } from "./services/VulnerabilityScanService";

async function run() {
  // does anchor-cli exist
  var exists = commandExists.sync("anchore-cli");
  if (!exists) {
    task.setResult(task.TaskResult.Failed, "anchore-cli is not installed");
    return;
  }

  var service = new AnchoreService(
    TaskInput.getEngineUser(),
    TaskInput.getEnginePassword(),
    TaskInput.getEngineUrl()
  );

  try {
    // add the image to anchore engine
    service.addImage(TaskInput.getImageName());

    // analyze the image
    const analysisService = new AnalyzeImageService(service);
    const imageAnalyzed: boolean = await analysisService.analyzeImage(TaskInput.getImageName());
    if (!imageAnalyzed) {
      task.setResult(task.TaskResult.Failed, "Image failed to be analyzed");
      return;
    }

    if (TaskInput.getExecutePolicyScan()) {
      console.log("Performing Policy Scan");


      var result = service.getPolicyEvaluateResult(TaskInput.getImageName());
      if (result.status == PolicyCheckStatus.FAIL) {
        task.setResult(task.TaskResult.Failed, 'Image Failed Policy Check');
        return;
      }
    }
    
    if (TaskInput.getExecuteVulnScan()) {
      const vulnerabilityScanService = new VulnerabilityScanService(service);
      console.log("Performing Vulnerability Checks");
      vulnerabilityScanService.executeVulnerabilityScan(TaskInput.getImageName());

      const highCount: Number = vulnerabilityScanService.getCount(VulnSeverity.HIGH);
      if (highCount > TaskInput.getMinimumHighCount() && TaskInput.getMinimumHighCount() >= 0) {
        task.setResult(task.TaskResult.Failed, "Scanned image has too many high vulnerabilities");
        return;
      }

      const mediumCount: Number = vulnerabilityScanService.getCount(VulnSeverity.MEDIUM);
      if (mediumCount > TaskInput.getMinimumMediumCount() && TaskInput.getMinimumMediumCount() >= 0) {
        task.setResult(task.TaskResult.Failed, "Scanned image has too many medium vulnerabilities");
        return;
      }

      const lowCount: Number = vulnerabilityScanService.getCount(VulnSeverity.LOW);
      if (lowCount > TaskInput.getMinimumLowCount() && TaskInput.getMinimumLowCount() >= 0) {
        task.setResult(task.TaskResult.Failed, "Scanned image has too many low vulnerabilities");
        return;
      }

      const negligibleCount: Number = vulnerabilityScanService.getCount(VulnSeverity.NEGLIGIBLE);
      if (negligibleCount > TaskInput.getMinimumNegligibleCount() && TaskInput.getMinimumNegligibleCount() >= 0) {
        task.setResult(task.TaskResult.Failed, "Scanned image has too many neglibile vulnerabilities");
        return;
      }

      if (TaskInput.getVulnScanExportPath() !== "") {
        vulnerabilityScanService.saveHtmlReport(TaskInput.getVulnScanExportPath());
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
