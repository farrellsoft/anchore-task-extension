import { VulnScanItem } from "../models/VulnerabilityScanItemResult";
import fs from 'fs';
import path from 'path';

export class VulnScanHtmlExporter {
    constructor(
        private scanResults: VulnScanItem[]
    ) {}

    saveFile(filePath: string): void {
        const resultString = this.getHtmlStart() +
            this.buildResultsTable() +
            this.getHtmlEnd();

        console.log(`Writing out HTML contents to ${filePath}/vuln_report.html`);
        fs.writeFileSync(path.join(filePath, 'vuln_report.html'), resultString);
    }

    private getHtmlStart(): string {
        return `<!DOCTYPE html>
            <html lang="en" >
                <head>
                    <title>Anchore Vulnerability Scan Results</title>
                </head>

                <body>
                    <h2>Anchore Vulnerability Scan Results</h2>
                    <table cellspacing="5" border="1">
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