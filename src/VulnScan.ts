import { TaskInput } from "./TaskInput";
import { AnchoreService } from "./AnchoreService";
import { VulnScanItem } from "./interfaces/VulnScanning";

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
        this.scanResults = JSON.parse(resultJsonString);
    }
}