import fs from 'fs';
import { Buffer } from 'buffer';
import * as core from "@actions/core";
import YAML from 'yaml'
import { temporaryFile } from 'tempy';
import * as lib from "./lib";

export const client = async (input: lib.Input) => {
  if (!input.path) {
    // path is a flag to indicate if the file is already created
    // If not, create a temporary file and set the flag
    input.path = temporaryFile();
    core.exportVariable("SECUREFIX_FILE_PATH", input.path);
  }
  // Read the input data
  // Parse it as YAML
  // Convert it to JSON
  // Encode it to base64
  // Append it to the temporary file
  fs.appendFileSync(input.path, Buffer.from(JSON.stringify(YAML.parse(input.data))).toString('base64'));
};
