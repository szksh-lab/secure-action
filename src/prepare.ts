import fs from "fs";
import path from "path";
import { Buffer } from "buffer";
import * as core from "@actions/core";
import * as github from "@actions/github";
import {
  LabelCreatedEvent,
  WorkflowRunCompletedEvent,
} from "@octokit/webhooks-types";
import artifactClient from "@actions/artifact";
import * as lib from "./lib";

export const run = async (input: lib.Input) => {
  // prepare parse the input data and outputs it as JSON
  // output pull request number
  switch (github.context.eventName) {
    case "workflow_run":
      return await handleWorkflowRun(input);
    case "label":
      return await handleLabel(input);
  }
};

export const handleWorkflowRun = async (input: lib.Input) => {
  const workflowRunEvent = github.context.payload as WorkflowRunCompletedEvent;
  if (workflowRunEvent.workflow_run.pull_requests.length === 1) {
    core.setOutput(
      "pull_request_number",
      workflowRunEvent.workflow_run.pull_requests[0].number,
    );
  }
  // download artifacts
  core.info(
    `Listing artifacts ${github.context.repo.owner}/${github.context.repo.repo} ${workflowRunEvent.workflow_run.id}`,
  );
  const listArtifactResponse = await artifactClient.listArtifacts({
    findBy: {
      workflowRunId: workflowRunEvent.workflow_run.id,
      repositoryOwner: github.context.repo.owner,
      repositoryName: github.context.repo.repo,
      token: input.githubToken,
    },
  });
  const ops: any[] = [];
  for (const artifact of listArtifactResponse.artifacts) {
    if (!artifact.name.startsWith("secure-action--")) {
      core.info(`Ignoring an artifact ${artifact.name}`);
      continue;
    }
    core.info(`Downloading an artifact ${artifact.name}`);
    await artifactClient.downloadArtifact(artifact.id, {
      path: artifact.name,
      findBy: {
        workflowRunId: workflowRunEvent.workflow_run.id,
        repositoryOwner: github.context.repo.owner,
        repositoryName: github.context.repo.repo,
        token: input.githubToken,
      },
    });
    const file = path.join(artifact.name, "ops.txt");
    core.info(`Reading an artifact ${file}`);
    ops.push(
      ...fs
        .readFileSync(file, "utf8")
        .split("\n")
        .map((line: string) =>
          JSON.parse(Buffer.from(line, "base64").toString()),
        ),
    );
  }
  core.info(`ops: ${JSON.stringify(ops)}`);
  core.setOutput("ops", JSON.stringify(ops));
};

export const handleLabel = async (input: lib.Input) => {
  // get a label name and description
  const labelEvent = github.context.payload as LabelCreatedEvent;
  const artifactName = labelEvent.label.name;
  // <repo>/<workflow_run_id>
  const arr = labelEvent.label.description?.split("/");
  if (arr === undefined) {
    return;
  }
  if (arr.length !== 2) {
    return;
  }
  const repo = arr[0];
  const runID = arr[1];
  // download the artifact
  core.info(`Getting an artifact ${artifactName}`);
  const resp = await artifactClient.getArtifact(artifactName, {
    findBy: {
      workflowRunId: parseInt(runID),
      repositoryOwner: github.context.repo.owner,
      repositoryName: repo,
      token: input.githubToken,
    },
  });
  core.info(`Downloading an artifact ${artifactName}`);
  await artifactClient.downloadArtifact(resp.artifact.id, {
    findBy: {
      workflowRunId: parseInt(runID),
      repositoryOwner: github.context.repo.owner,
      repositoryName: repo,
      token: input.githubToken,
    },
  });
  const ops = JSON.stringify(
    fs
      .readFileSync("ops.txt", "utf8")
      .split("\n")
      .map((line: string) =>
        JSON.parse(Buffer.from(line, "base64").toString()),
      ),
  );
  core.info(`ops: ${ops}`);
  core.setOutput("ops", ops);
};
