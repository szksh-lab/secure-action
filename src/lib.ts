import * as core from "@actions/core";
import * as github from "@actions/github";
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
  artifactName: string;
  // The ops to be applied
  ops: string;
  // Optional inputs
  // GitHub Access Token
  githubToken: string;
  // Environment variables
  // A file path to store the temporary file
  path: string;
  // A flag to indicate if the file has already been uploaded
  fileUploaded: boolean;
};

const Operation = z.object({
  handler: z.string(),
  method: z.string(),
  data: z.any(),
});
export type Operation = z.infer<typeof Operation>;

const Operations = z.array(Operation);

export const readOpts = (opts: string): Operation[] => {
  return Operations.parse(JSON.parse(opts));
};
