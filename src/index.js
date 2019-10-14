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
Object.defineProperty(exports, "__esModule", { value: true });
const task = require("azure-pipelines-task-lib/task");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const anchoreUrl = task.getInput("anchoreEngineUrl", true);
        const anchoreUser = task.getInput("anchoreEngineUser", true);
        const anchorePassword = task.getInput("anchoreEnginePassword", true);
        console.log(anchoreUrl);
        console.log(anchoreUser);
        console.log(anchorePassword);
        console.log("Run successful");
    });
}
run();
