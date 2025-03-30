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
    throw new Error("path is not set");
  }
  if (!input.serverRepository) {
    throw new Error("server_repository is not set");
  }
  const artifactPrefix = "secure-action-label--";
  const artifact = `${artifactPrefix}${Array.from({ length: 29 }, () => Math.floor(Math.random() * 36).toString(36)).join("")}`;
  core.saveState("artifact", artifact);
  await lib.upload(input, artifact);
  await triggerWorkflowByLabel(input, artifact);
};

export const triggerWorkflowByLabel = async (
  input: lib.Input,
  label: string,
) => {
  const octokit = github.getOctokit(input.githubToken);
  await octokit.rest.issues.createLabel({
    owner: github.context.repo.owner,
    repo: input.serverRepository,
    name: label,
    description: `${input.serverRepository}/${process.env.GITHUB_RUN_ID}`,
  });
  await setTimeout(1000);
  await octokit.rest.issues.deleteLabel({
    owner: github.context.repo.owner,
    repo: input.serverRepository,
    name: label,
  });
};
