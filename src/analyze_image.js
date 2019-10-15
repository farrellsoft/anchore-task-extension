"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MAX_ATTEMPTS = 100;
const ANALYZED_STATUS_COMPLETED = "analyzed";
function analyzeImage(sdk, imageRequest) {
    var current_attempt = 1;
    var analysisComplete = false;
    do {
        console.log(`Attempt #${current_attempt}`);
        var resultString = sdk.getImageDetailsCommandString(imageRequest);
        var matches = resultString.match(/Analysis Status: (\w+)\W+/);
        if (matches && matches.length > 1) {
            var analyzed_status = matches[1];
            if (analyzed_status == ANALYZED_STATUS_COMPLETED) {
                analysisComplete = true;
                break;
            }
        }
        current_attempt++;
    } while (current_attempt <= MAX_ATTEMPTS);
    return analysisComplete;
}
exports.default = analyzeImage;
