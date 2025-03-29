import fs from "fs";
import path from "path";
import * as core from "@actions/core";
import { DefaultArtifactClient } from "@actions/artifact";
import * as lib from "./lib";

export const post = async (input: lib.Input) => {
  switch (input.action) {
    case "":
      break;
    case "client":
      break;
    default:
      return;
  }
  // post upload a file to the artifact
  if (input.fileUploaded) {
    core.debug("File already uploaded");
    return;
  }
  // validate
  fs.readFileSync(path.join(input.path, "ops.txt"), "utf8")
    .split("\n")
    .map((line: string) => JSON.parse(Buffer.from(line, "base64").toString()));
  // upload to artifact
  const artifact = new DefaultArtifactClient();
  await artifact.uploadArtifact(
    input.artifactName,
    [path.join(input.path, "ops.txt")],
    input.path,
  );
  // mark complete
  core.exportVariable("SECUREFIX_FILE_UPLOADED", "true");
};
