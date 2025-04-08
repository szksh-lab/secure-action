import fs from "fs";
import os from "os";
import path from "path";
import { Buffer } from "buffer";
import { setTimeout } from "timers/promises";
import * as core from "@actions/core";
import * as github from "@actions/github";
import YAML from "yaml";
import * as lib from "./lib";

export const run = async (input: lib.Input) => {
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
    path.join(input.path, "tasks.txt"),
    Buffer.from(
      JSON.stringify({
        handler: input.handler,
        data: YAML.parse(input.data),
      }),
    ).toString("base64"),
  );
  const artifactPrefix = `secure-action--${Date.now()}-`;
  const artifact = `${artifactPrefix}${Array.from({ length: 32 }, () => Math.floor(Math.random() * 36).toString(36)).join("")}`;
  core.saveState("artifact", artifact);
};
