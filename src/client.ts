import fs from "fs";
import os from "os";
import path from "path";
import { Buffer } from "buffer";
import * as core from "@actions/core";
import YAML from "yaml";
import * as lib from "./lib";

export const client = async (input: lib.Input) => {
  if (!input.path) {
    // path is a flag to indicate if the file is already created
    // If not, create a temporary file and set the flag
    input.path = fs.mkdtempSync(path.join(os.tmpdir(), "securefix"));
    core.exportVariable("SECUREFIX_FILE_DIR", input.path);
  }
  // Read the input data
  // Parse it as YAML
  // Convert it to JSON
  // Encode it to base64
  // Append it to the temporary file
  fs.appendFileSync(
    path.join(input.path, "ops.txt"),
    Buffer.from(
      JSON.stringify({
        handler: input.handler,
        method: input.method,
        data: YAML.parse(input.data),
      }),
    ).toString("base64"),
  );
};
