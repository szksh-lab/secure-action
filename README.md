# secure-action

[![License](http://img.shields.io/badge/license-mit-blue.svg?style=flat-square)](https://raw.githubusercontent.com/secure-action/action/main/LICENSE) | [Versioning Policy](https://github.com/suzuki-shunsuke/versioning-policy/blob/main/POLICY.md)

> [!CAUTION]
> The status is still alpha.
> Please don't use this in the production environment.
> API is unstable, and some features described in the document may not be implemented.
> In future, we will archive this repository and create a new one in the other GitHub Organization.

Secure Action is GitHub Actions to run any pre-defined tasks securely.
It allows you to run any tasks securely without granting strong permissions to GitHub Actions workflows which many people can edit.
It elevates the security of your workflows to the next level.

Furthermore, it's easy to use.
You don't need to host a server application.
It achieves a Client/Server Module using GitHub Actions by unique approach.

## Compared with Securefix Action

We have developed [Securefix Action, which is a GitHub Actions to fix code securely](https://github.com/securefix-action/action).
We developed Secure Action to extend Securefix Action for not only fixing code but also running any tasks.
The architecture of Secure Action is heavily inspired to Securefix Action.
So please check Securefix Action out too.

## Features

- 💪 Increase the developer productivity by running tasks in CI
- 🛡 Secure
  - You don't need to pass a GitHub App private key with strong permissions to GitHub Actions workflows on the client side
  - You don't need to allow external services to access your code
  - You can define custom validation before creating a commit
- 😊 Easy to use
  - You don't need to host a server application
- 😉 [OSS (MIT License)](LICENSE)

## Overview

We assume two use cases:

1. Run tasks via pull requests from fork repositories securely
1. Run tasks in private repositories for your business securely

--

1. Sometimes you want to run tasks via pull requests from fork repositories:

- Add labels
- Post comments
- Create reviews

These tasks need write permissions, but pull_request workflows don't have these permissions and can't read GitHub Secrets.
`pull_request_target` has write permissions and can read GitHub Secrets, but [it's dangerous](https://securitylab.github.com/resources/github-actions-preventing-pwn-requests/).

Secure Action can run these tasks securely by `workflow_run` event.

--

2. In the team development on private repositories, sometimes you want to call API of GitHub and SaaS such as AWS in GitHub Actions.
You can grant the permission to GitHub Actions, but it may be abused.
For instance, an attacker may be able to create a pull request with malicious commits using GitHub App and approve and merge the pull request.

To solve this problem, Secure Action adopts a Client/Server Model.
A client workflow is a workflow which people trigger.
The client workflow itself doesn't have strong permissions.
It sends requests to server workflows.
Server workflows validate requests and run them.
By validation, client workflows can run only allowed tasks.

Secure Action builds a Client/Server Model using GitHub Actions.
You don't need to host a server application.

## Example

Coming soon.

## Architecture

Secure Action adopts a Client/Server Model.
It uses following GitHub Apps, repositories, and workflows:

- two GitHub Apps
  - a Server GitHub App: a GitHub App to handle tasks
  - a Client GitHub App: a GitHub App to send requests to a server workflow
    - If you use `workflow_run` event, this app is unnecessary
- Repositories
  - a Server repository: a repository where a server workflow works
  - Client repositories: repositories where client workflows work
- Workflows
  - a Server Workflow: Receive and handle requests from client workflows
  - a Client Workflow: Send requests to the Server Workflow

![Image](https://github.com/user-attachments/assets/94781831-0aad-4513-ac92-fb5cfa859e19)

- Server: 1 GitHub App, 1 Repository
- Client: 1 GitHub App, N Repositories

![Image](https://github.com/user-attachments/assets/383de1da-a267-4f96-a86c-9151d66cebc5)

1. The client workflow uploads requests to GitHub Actions Artifacts
2. The client workflow creates an issue label to the server repository (The label is deleted immediately)
3. The server workflow is triggered by `label:created` event
4. The server workflow downloads requests from GitHub Actions Artifacts
5. The server workflow validates requests
6. The server workflow handles requests

You can also use `workflow_run` event instead of `label:created` event.
`workflow_run` is useful for pull requests from fork repositories.

### :bulb: Why are labels used?

Secure Action uses `label` event to trigger a server workflow.
Generally `repository_dispatch` or `workflow_dispatch` events are used to trigger workflows by API, but they require the permission `contents:write`.
This permission is too strong.
So we looked for better events from [all events](https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows), and we found `label` event.
Even if the permission is abused, the risk is low.

## Getting Started

Coming soon.

## Actions

Coming soon.

## Official Tasks

Coming soon.

## Custom Tasks

Coming soon.

## Custom Validation

Coming soon.

## Notification

Coming soon.
