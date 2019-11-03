import { TaskInput } from "./TaskInput";
import { AnchoreService } from "./AnchoreService";
import { VulnScanItem, VulnScanRoot } from "./interfaces/VulnScanning";
import { VulnSeverity } from './enum';
import { VulnScanHtmlExporter } from "./exporters/VulnScanHtmlExporter";

export class VulnScan {
    private scanResults: VulnScanItem[];

    constructor(
        private taskInput: TaskInput,
        private anchoreService: AnchoreService
    ) {
        this.scanResults = [];
    }

    executeScan(): void {
        var resultJsonString: string = this.anchoreService.getAllImageVulnResults(this.taskInput.getImageName());
        var parsedResult: VulnScanRoot = JSON.parse(resultJsonString);

        this.scanResults = parsedResult.vulnerabilities;
    }

    getCount(severity: VulnSeverity): Number {
        var results: VulnScanItem[] = this.scanResults.filter((x) => {
            return x.severity === severity;
        });

        return results.length;
    }

    saveHtmlReport(filePath: string): void {
        var exporter = new VulnScanHtmlExporter(this.scanResults);
        exporter.saveFile(filePath);
    }
}