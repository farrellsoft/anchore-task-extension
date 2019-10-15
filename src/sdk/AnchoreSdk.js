"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const cp = __importStar(require("child_process"));
class AnchoreSdk {
    constructor(pUsername, pPassword, pAnchoreUrl) {
        if (pUsername == undefined)
            throw new Error("Username is not defined for Anchore API calls");
        this.username = pUsername;
        if (pPassword == undefined)
            throw new Error("Password is not defined for the Anchor API calls");
        this.password = pPassword;
        if (pAnchoreUrl == undefined)
            throw new Error("Anchore Url is not defined for the Anchor API calls");
        this.anchoreUrl = pAnchoreUrl;
    }
    addImage(imageRequest) {
        if (imageRequest == undefined)
            throw new Error("Image Request cannot be empty - please specify an image to add");
        cp.execSync(`anchore-cli --u ${this.username} --p ${this.password} --url ${this.anchoreUrl} image add ${imageRequest}`);
        return true;
    }
    getImageDetailsCommandString(imageRequest) {
        if (imageRequest == undefined)
            throw new Error("Image Request cannot be empty - please specify an image to get details for");
        var buffer = cp.execSync(`anchore-cli --u ${this.username} --p ${this.password} --url ${this.anchoreUrl} image get ${imageRequest}`);
        return buffer.toString();
    }
}
exports.AnchoreSdk = AnchoreSdk;
