import * as github from "@actions/github";
import * as lib from "./lib";

export const run = async (input: lib.Input) => {
  const opts = lib.readOpts(input.ops);
  for (const op of opts) {
    await apply(input.githubToken, op);
  }
};

const apply = async (githubToken: string, op: lib.Operation) => {
  const octokit = github.getOctokit(githubToken);
  if (op.handler !== "github_api") {
    return;
  }
  const funcs = new Map<string, any>([
    ["rest.issues.createLabel", octokit.rest.issues.createLabel],
  ]);
  const fn = funcs.get(op.method);
  if (!fn) {
    throw new Error(`Invalid action ${op.method}`);
  }
  await fn(op.data);
};
