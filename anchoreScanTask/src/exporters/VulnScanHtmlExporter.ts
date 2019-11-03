import { VulnScanItem } from "../interfaces/VulnScanning";
import fs from 'fs';

export class VulnScanHtmlExporter {
    constructor(
        private scanResults: VulnScanItem[]
    ) {}

    saveFile(filePath: string): void {
        const resultString = this.getHtmlStart() +
            this.buildResultsTable() +
            this.getHtmlEnd();

        fs.writeFileSync(filePath, resultString);
    }

    private getHtmlStart(): string {
        return `<!DOCTYPE html>
            <html lang="en" >
                <head>
                    <title>Anchore Vulnerability Scan Results</title>
                </head>

                <body>
                    <h2>Anchore Vulnerability Scan Results</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Vulnerability ID</th>
                                <th>Package</th>
                                <th>Severity</th>
                                <th>Fix</th>
                            </tr>
                        </thead>
                        <tbody>`;
                
    }

    private buildResultsTable(): string {
        var resultTableString = "";
        this.scanResults.forEach(scanResult => {
            resultTableString += `
                <tr>
                    <td>
                        <a href="${scanResult.url}">${scanResult.vuln}</a>
                    </td>
                    <td>${scanResult.package}</td>
                    <td>${scanResult.severity.toString()}</td>
                    <td>${scanResult.fix}</td>
                </tr>`;
        });

        return resultTableString;
    }

    private getHtmlEnd(): string {
        return `            </tbody>
                        </table>
                    </body>
                </html>`;
    }
}