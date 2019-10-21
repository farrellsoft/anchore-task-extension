
const fs = require("fs");

const ref_tag_string = process.argv[2];
const tag_version_regex = /^refs\/tags\/v(?<version>\d\.\d\.\d)$/;
const isMatch = ref_tag_string.match(tag_version_regex);

if (!isMatch) {
    throw new Error("Invalid Version string");
}

const new_version = isMatch.groups["version"];

const glob_path = process.argv[3];
const glob_json = JSON.parse(fs.readFileSync(glob_path));
glob_json.version = new_version;
fs.writeFileSync(glob_path, JSON.stringify(glob_json));