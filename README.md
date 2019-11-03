# Azure DevOps Anchore Task Extension

The Anchor task is created by me (Jason Farrell) with permission from Anchore (https://anchore.com/) as an open source extension to enable integration of
Anchore Engine Image Scanner into Azure DevOps pipelines in both Build and Release modes.

## Getting Started

This guide assumes you have an Anchore Engine running somewhere that is accessible to Azure DevOps. An explanation of how to setup and configure the Engine server can be found here (https://docs.anchore.com/current/docs/engine/engine_installation/).

### Task Properties

**Anchore Engine Url (Required)**

This is the Url to your Anchore Engine API (ex. https://my.anchore.engine/v1) this is what the task will call out to and leverage when adding and analyzing images.

**Anchore Engine Username (Required)**

This is the Username used to authenticate to the Anchore Engine API. When using this task the user should be setup ahead of time. More information (https://docs.anchore.com/current/docs/engine/usage/cli_usage/accounts/)

**Anchore Engine Password (Required)**

This is the password used to authenticate to the Anchore Engine API. As with the username, it should be setup ahead of time. Refer to link above

**Analyze Image (Required)**

This is the image that will be targeted for analysis during execution. You will want to use build variables to ensure the correct image can be targeted. Note that for Anchore Engine to analyze the image it must __**FIRST**__ be pushed to an accessible registry. For private registries, the registry will need to be registered with Anchore to permit access. More Information (https://docs.anchore.com/current/docs/engine/usage/cli_usage/registries/)

**Perform a vulernability scan for the image**

Indicates whether the task should perform a Vulnerability Check following the analysis step.

**Min High Allowed (Available if Vuln scan performed)**

The minimum number of High Vulnerabilities to allow before the Task fails. If left empty, no limit is enforced

**Min Medium Allowed (Available if Vuln scan performed)**

The minimum number of Medium Vulnerabilities to allow before the Task fails. If left empty, no limit is enforced

**Min Low Allowed (Available if Vuln scan performed)**

The minimum number of Low Vulnerabilities to allow before the Task fails. If left empty, no limit is enforced

**Min Negligibile Allowed (Available if Vuln scan performed)**

The minimum number of Negligible Vulnerabilities to allow before the Task fails. If left empty, no limit is enforced

**Vuln Report Export Path**

Indicates where the task should output the results of the Vulnerability Scan - HTML report

## How the Task Works

#### Prerequisites

* `anchore-cli` is installed via Python `pip`
* Target image is pushed to a public or repository registered with Anchore Engine (see Task Properties)

#### Steps

1. Task will add the image to Anchore Engine via the `image add` command
2. Following the add Task will poll Anchore Engine for the specific image until status of `analyzed` is read
    * Max tries is 100 attempts to prevent endless looping in the event of error within Anchor Engine
3. If selected task will execute a `vuln all` command against the image in question
4. If limits are in place, the actual totals will be counted and compared against these specified limits

``` More to come as additional features are added ```

## Future Features

Anchore Engine provides many features to aid in deeper scanning of images that are not yet supported. I am activity seeking people to get involved and assist. Full details are available under the Product tab on the GitHub page

## Disclaimer

I am not an employee of Anchore nor am I affiliated with their organization. Nor is my current employer in any way responsible for this extension. This is purely a side project that I maintain in my free time.