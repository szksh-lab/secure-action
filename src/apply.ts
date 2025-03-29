import * as github from "@actions/github";
import * as lib from "./lib";

export const run = async (input: lib.Input) => {
  const opts = lib.readOps(input.ops);
  for (const op of opts) {
    await apply(input.githubToken, op);
  }
};

const apply = async (githubToken: string, op: lib.Operation) => {
  const octokit = github.getOctokit(githubToken);
  if (op.handler !== "octokit/rest.js") {
    return;
  }
  let entity: any = octokit;
  for (const key of op.method.split(".")) {
    entity = entity[key];
    if (entity === undefined) {
      throw new Error(`unsupported method: ${op.method} (${key})`);
    }
  }
  await entity(op.data);
};
