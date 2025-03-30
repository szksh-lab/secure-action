import * as core from "@actions/core";
import * as lib from "./lib";

export const run = async (input: lib.Input) => {
  switch (input.action) {
    case "":
      break;
    case "client":
      break;
    default:
      return;
  }
  // post upload a file to the artifact
  await lib.upload(input, core.getState("artifact"));
};
