import { AnchoreSdk } from "./sdk/AnchoreSdk";

const MAX_ATTEMPTS: number = 100;
const ANALYZED_STATUS_COMPLETED = "analyzed";

export default function analyzeImage(sdk: AnchoreSdk, imageRequest: string | undefined): boolean {
  var current_attempt = 1;
  var analysisComplete: boolean = false;
  do {
    console.log(`Attempt #${current_attempt}`);
    var resultString: string = sdk.getImageDetailsCommandString(imageRequest);

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
