import * as core from "@actions/core";
import * as lib from "./lib";
import { DefaultArtifactClient } from "@actions/artifact";

export const post = async (input: lib.Input) => {
  // post upload a file to the artifact
  if (input.fileUploaded) {
    core.debug("File already uploaded");
    return;
  }
  // upload to artifact
  const artifact = new DefaultArtifactClient();
  await artifact.uploadArtifact(input.artifactName, [input.path], "");
  // mark complete
  core.exportVariable("SECUREFIX_FILE_UPLOADED", "true");
};
