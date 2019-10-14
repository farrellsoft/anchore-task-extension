import task = require("azure-pipelines-task-lib/task");
import commandExists from "command-exists";
import * as cp from "child_process";
import * as tp from "typed-promisify";

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

  // add the image to anchore engine
  var commandString: string = `anchore-cli --u ${anchoreUser} --p ${anchorePassword} --url ${anchoreUrl} image add ${anchoreImage}`;
  console.log(commandString);

  var execOutput: Buffer = cp.execSync(commandString);
  if (!execOutput) {
    task.setResult(
      task.TaskResult.Failed,
      "Failed to add Image to Achore Scanning engine"
    );
    return;
  }

  // now wait for the analysis to complete
  var max_attempts = 100;
  var current_attempt = 1;
  const analyzed_status_complete = "analyzed";

  commandString = `anchore-cli --u ${anchoreUser} --p ${anchorePassword} --url ${anchoreUrl} image get ${anchoreImage}`;

  do {
    console.log(`Attempt #${current_attempt}`);
    var resultBuffer: Buffer = cp.execSync(commandString);
    var resultString = resultBuffer.toString();

    var matches = resultString.match(/Analysis Status: (\w+)\W+/);
    if (matches && matches.length > 1) {
      var analyzed_status = matches[1];
      if (analyzed_status == analyzed_status_complete) {
        break;
      }
    }

    current_attempt++;
    await new Promise(resolve => setTimeout(resolve, 5000));
  } while (current_attempt <= max_attempts);

  console.log("run completed");
}

run();
