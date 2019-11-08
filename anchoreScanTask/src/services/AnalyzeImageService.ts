import { AnchoreService } from "./AnchoreService";
import { GetImageResult } from "../models/GetImageResult";
import { AnalysisStatus } from "../enum";

export class AnalyzeImageService {
  private MAX_ATTEMPTS: number = 100;

  constructor(
    private anchoreService: AnchoreService
  ) {}

  async analyzeImage(imageName: string): Promise<boolean> {
    var current_attempt = 1;
    var analysisComplete: boolean = false;
    do {
      console.log(`Checking Status Attempt #${current_attempt}`);
      var result: GetImageResult = this.anchoreService.getImageDetailsResults(imageName);

      // check status
      if (result.analysis_status == AnalysisStatus.ANALYZED) {
        analysisComplete = true;
        break;
      }

      current_attempt++;

      await this.delay(5);
    } while (current_attempt <= this.MAX_ATTEMPTS);

    return analysisComplete;
  }

  private async delay(msCount: number): Promise<any> {
    return new Promise(resolve => setTimeout(resolve, msCount * 1000));
  }
}
