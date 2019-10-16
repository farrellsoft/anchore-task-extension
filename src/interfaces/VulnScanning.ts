
import { VulnSeverity } from '../enum';

export interface VulnScanRoot {
    vulnerabilities: VulnScanItem[];
}

export interface VulnScanItem {
    feed: string;
    feed_group: string;
    fix: string;
    package: string;
    package_name: string;
    package_type: string;
    severity: VulnSeverity;
    url: string;
    vuln: string;
}