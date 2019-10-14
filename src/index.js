"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const task = require("azure-pipelines-task-lib/task");
const command_exists_1 = __importDefault(require("command-exists"));
const cp = __importStar(require("child_process"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const anchoreUrl = task.getInput("anchoreEngineUrl", true);
        const anchoreUser = task.getInput("anchoreEngineUser", true);
        const anchorePassword = task.getInput("anchoreEnginePassword", true);
        const anchoreImage = task.getInput("anchoreImage", true);
        // does anchor-cli exist
        var exists = command_exists_1.default.sync("anchore-cli");
        if (!exists) {
            task.setResult(task.TaskResult.Failed, "anchore-cli is not installed");
            return;
        }
        // add the image to anchore engine
        var commandString = `anchore-cli --u ${anchoreUser} --p ${anchorePassword} --url ${anchoreUrl} image add ${anchoreImage}`;
        console.log(commandString);
        var execOutput = cp.execSync(commandString);
        if (!execOutput) {
            task.setResult(task.TaskResult.Failed, "Failed to add Image to Achore Scanning engine");
            return;
        }
        // now wait for the analysis to complete
        var max_attempts = 100;
        var current_attempt = 1;
        const analyzed_status_complete = "analyzed";
        commandString = `anchore-cli --u ${anchoreUser} --p ${anchorePassword} --url ${anchoreUrl} image get ${anchoreImage}`;
        do {
            console.log(`Attempt #${current_attempt}`);
            var resultBuffer = cp.execSync(commandString);
            var resultString = resultBuffer.toString();
            var matches = resultString.match(/Analysis Status: (\w+)\W+/);
            if (matches && matches.length > 1) {
                var analyzed_status = matches[1];
                if (analyzed_status == analyzed_status_complete) {
                    break;
                }
            }
            current_attempt++;
            yield new Promise(resolve => setTimeout(resolve, 5000));
        } while (current_attempt <= max_attempts);
        console.log("run completed");
    });
}
run();
