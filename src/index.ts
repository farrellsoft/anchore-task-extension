import task = require("azure-pipelines-task-lib/task");
import commandExists from "command-exists";
import * as cp from "child_process";

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
  var exists = commandExists.sync("anchore-cli --version");
  if (!exists) {
    console.log("anchore-cli is not installed");
    return;
  }

  // add the image to anchore engine
  var addImageExec: cp.ChildProcess = cp.exec(
    `anchore - cli--u ${anchoreUser}--p ${anchorePassword} --url ${anchoreUrl} image add ${anchoreImage}"
  );
}

run();
