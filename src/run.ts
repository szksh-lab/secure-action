import fs from 'fs'
import { Buffer } from 'buffer';
import * as core from "@actions/core";
import * as github from "@actions/github";
import YAML from 'yaml'
import { temporaryFile } from 'tempy';
import * as lib from "./lib";
import * as post from "./post";
import * as client from "./client";
import * as prepare from "./prepare";
import * as apply from "./apply";

export const main = async () => {
  run({
    post: core.getState("post"),
    data: core.getInput("data", { required: true }),
    artifactName: core.getInput("artifact_name"),
    action: core.getInput("action"),
    ops: core.getInput("ops"),
    githubToken: core.getInput("github_token"),
    path: process.env.SECUREFIX_FILE_PATH || "",
    fileUploaded: process.env.SECUREFIX_FILE_UPLOADED === "true",
  });
};

const run = async (input: lib.Input) => {
  if (input.post) {
    post.post(input);
    return;
  }
  core.saveState("post", "true");
  switch (input.action) {
    case "":
      client.client(input);
    case "server/prepare":
      prepare.prepare(input);
    case "server/apply":
      apply.run(input);
    default:
      throw new Error("Invalid action");
  }
};
