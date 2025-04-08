import * as github from "@actions/github";
import * as lib from "./lib";

export const run = async (input: lib.Input) => {
  // Notify the failure
  // Get the repository owner, name, and pull request number
  // Create a body
  // Post a comment
  const tasks = lib.readTasks(input.tasks);
  const octokit = github.getOctokit(input.githubToken);
  const body = `# :x: Task failed
[Workflow](${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}) failed.
`;
  for (const task of tasks) {
  }
  // output tasks
  // info, warning, error
  // read GITHUB_STEP_SUMMARY
  await octokit.rest.issues.createComment({
    owner: github.context.repo.owner,
    repo: github.context.repo.owner,
    issue_number: 0,
    body: body,
  });
};
