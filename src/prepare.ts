import fs from "fs";
import path from "path";
import { Buffer } from "buffer";
import * as core from "@actions/core";
import * as github from "@actions/github";
import { WorkflowRunCompletedEvent } from "@octokit/webhooks-types";
import * as lib from "./lib";

export const prepare = async (input: lib.Input) => {
  // prepare parse the input data and outputs it as JSON
  // output pull request number
  switch (github.context.eventName) {
    case "workflow_run":
      const workflowRunEvent = github.context
        .payload as WorkflowRunCompletedEvent;
      if (workflowRunEvent.workflow_run.pull_requests.length === 1) {
        core.setOutput(
          "pull_request_number",
          workflowRunEvent.workflow_run.pull_requests[0].number,
        );
      }
    case "workflow_dispatch":
    case "repository_dispatch":
    case "label":
  }
  core.setOutput(
    "ops",
    JSON.stringify(
      fs
        .readFileSync(path.join(input.path, "ops.txt"), "utf8")
        .split("\n")
        .map((line: string) =>
          JSON.parse(Buffer.from(line, "base64").toString()),
        ),
    ),
  );
};
