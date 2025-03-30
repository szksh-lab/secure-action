import fs from "fs";
import { Buffer } from "buffer";
import * as core from "@actions/core";
import * as github from "@actions/github";
import YAML from "yaml";
import * as lib from "./lib";
import * as post from "./post";
import * as client from "./client";
import * as prepare from "./prepare";
import * as apply from "./apply";

export const main = async () => {
  run({
    post: core.getState("post"),
    action: core.getInput("action"),
    data: core.getInput("data"),
    // artifactName: core.getInput("artifact_name"),
    ops: core.getInput("ops"),
    githubToken: core.getInput("github_token"),
    handler: core.getInput("handler"),
    method: core.getInput("method"),
    path: process.env.SECUREFIX_FILE_DIR || "",
    serverRepository: core.getInput("server_repository"),
  });
};

const run = async (input: lib.Input) => {
  if (input.post) {
    post.run(input);
    return;
  }
  core.saveState("post", "true");
  switch (input.action) {
    case "":
      client.run(input);
      break;
    case "client":
      client.run(input);
      break;
    case "trigger":
      client.run(input);
      break;
    case "server/prepare":
      prepare.run(input);
      break;
    case "server/apply":
      apply.run(input);
      break;
    default:
      throw new Error("Invalid action");
  }
};
