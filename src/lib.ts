import fs from "fs";
import path from "path";
import * as core from "@actions/core";
import * as github from "@actions/github";
import { DefaultArtifactClient } from "@actions/artifact";
import { z } from "zod";

export type Input = {
  // state: A flag to indicate if the current action is a post action
  // If true, the action is a post action
  post: string;
  // A handler handling the operation
  handler: string;
  // A handler method
  method: string;
  // Required inputs
  data: string;
  // The action to be performed
  // client (default): Write the input data to a temporary file
  // server/prepare: Parse the input data and outputs it as JSON
  // server/apply: Apply the operations
  action: string;
  // The artifact name to be used for uploading the file
  // artifactName: string;
  // The ops to be applied
  ops: string;
  // Optional inputs
  // GitHub Access Token
  githubToken: string;
  // Environment variables
  // A file path to store the temporary file
  path: string;
  serverRepository: string;
};

const Operation = z.object({
  handler: z.string(),
  method: z.string(),
  data: z.any(),
});
export type Operation = z.infer<typeof Operation>;

const Operations = z.array(Operation);

export const readOps = (opts: string): Operation[] => {
  return Operations.parse(JSON.parse(opts));
};

export const upload = async (input: Input, artifactName: string) => {
  try {
    // validate
    core.info(`Validating the input data ${input.path}/ops.txt`);
    fs.readFileSync(path.join(input.path, "ops.txt"), "utf8")
      .split("\n")
      .map((line: string) =>
        JSON.parse(Buffer.from(line, "base64").toString()),
      );
  } catch (err: any) {
    if (err.code === "ENOENT") {
      // If the file does not exist, the file has already been uploaded.
      return;
    }
    throw err;
  }
  // Copy GITHUB_EVENT_PATH
  core.info(`Copying the file $GITHUB_EVENT_PATH to ${input.path}/event.json`);
  if (!process.env.GITHUB_EVENT_PATH) {
    throw new Error("GITHUB_EVENT_PATH is not set");
  }
  fs.copyFileSync(process.env.GITHUB_EVENT_PATH, path.join(input.path, "event.json"));
  // upload to artifact
  const artifact = new DefaultArtifactClient();
  core.info(`Uploading the artifact ${artifactName}`);
  await artifact.uploadArtifact(
    artifactName,
    [path.join(input.path, "ops.txt")],
    input.path,
  );
  // delete files
  core.info(`Deleting the uploaded file ${input.path}`);
  fs.rmSync(input.path, { recursive: true, force: true });
};
