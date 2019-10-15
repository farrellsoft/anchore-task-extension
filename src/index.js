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
Object.defineProperty(exports, "__esModule", { value: true });
const task = require("azure-pipelines-task-lib/task");
const command_exists_1 = __importDefault(require("command-exists"));
const AnchoreSdk_1 = require("./sdk/AnchoreSdk");
const analyze_image_1 = __importDefault(require("./analyze_image"));
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
        var sdk = new AnchoreSdk_1.AnchoreSdk(anchoreUser, anchorePassword, anchoreUrl);
        try {
            // add the image to anchore engine
            var addImageResult = sdk.addImage(anchoreImage);
            // analyze the image
            var imageAnalyzed = analyze_image_1.default(sdk, anchoreImage);
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
    });
}
run();
