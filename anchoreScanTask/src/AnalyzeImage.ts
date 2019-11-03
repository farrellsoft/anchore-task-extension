import { AnchoreService } from "./AnchoreService";

const MAX_ATTEMPTS: number = 100;
const ANALYZED_STATUS_COMPLETED = "analyzed";

export default async function analyzeImage(sdk: AnchoreService, imageRequest: string | undefined): Promise<boolean> {
  var current_attempt = 1;
  var analysisComplete: boolean = false;
  do {
    console.log(`Checking Status Attempt #${current_attempt}`);
    var resultString: string = sdk.getImageDetailsResults(imageRequest);

    var matches = resultString.match(/Analysis Status: (\w+)\W+/);
    if (matches && matches.length > 1) {
      var analyzed_status = matches[1];
      if (analyzed_status == ANALYZED_STATUS_COMPLETED) {
        analysisComplete = true;
        break;
      }
    }
    current_attempt++;

    await delay(5);
  } while (current_attempt <= MAX_ATTEMPTS);

  return analysisComplete;
}

function delay(msCount: number): Promise<any> {
  return new Promise( resolve => setTimeout(resolve, msCount * 1000) );
}
