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
  // Required inputs
  data: string;
  // The action to be performed
  // client (default): Write the input data to a temporary file
  // server/prepare: Parse the input data and outputs it as JSON
  // server/apply: Apply the tasks
  action: string;
  // The artifact name to be used for uploading the file
  // artifactName: string;
  // The tasks to be applied
  tasks: string;
  // Optional inputs
  // GitHub Access Token
  githubToken: string;
  // Environment variables
  // A file path to store the temporary file
  path: string;
  serverRepository: string;
};

const Task = z.object({
  handler: z.string(),
  data: z.any(),
});
export type Task = z.infer<typeof Task>;

const Tasks = z.array(Task);

export const readTasks = (tasks: string): Task[] => {
  return Tasks.parse(JSON.parse(tasks));
};

export const upload = async (input: Input, artifactName: string) => {
  try {
    // validate
    core.info(`Validating the input data ${input.path}/tasks.txt`);
    fs.readFileSync(path.join(input.path, "tasks.txt"), "utf8")
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
  fs.copyFileSync(
    process.env.GITHUB_EVENT_PATH,
    path.join(input.path, "event.json"),
  );
  // upload to artifact
  const artifact = new DefaultArtifactClient();
  core.info(`Uploading the artifact ${artifactName}`);
  await artifact.uploadArtifact(
    artifactName,
    [path.join(input.path, "tasks.txt")],
    input.path,
  );
  // delete files
  core.info(`Deleting the uploaded file ${input.path}`);
  fs.rmSync(input.path, { recursive: true, force: true });
};
