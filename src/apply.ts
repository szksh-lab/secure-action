import * as github from "@actions/github";
import * as lib from "./lib";

export const run = async (input: lib.Input) => {
  const tasks = lib.readTasks(input.tasks);
  for (const task of tasks) {
    await apply(input.githubToken, task);
  }
};

const apply = async (githubToken: string, task: lib.Task) => {
  const octokit = github.getOctokit(githubToken);
  if (task.handler !== "octokit/rest.js") {
    return;
  }
  if (!task.data.method) {
    throw new Error(`method is required`);
  }
  let entity: any = octokit;
  for (const key of task.data.method.split(".")) {
    entity = entity[key];
    if (entity === undefined) {
      throw new Error(`unsupported method: ${task.data.method} (${key})`);
    }
  }
  await entity(task.data.data);
};
