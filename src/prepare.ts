import fs from 'fs';
import { Buffer } from 'buffer';
import * as core from "@actions/core";
import * as lib from "./lib";

export const prepare = async (input: lib.Input) => {
  // prepare parse the input data and outputs it as JSON
  core.setOutput("ops", JSON.stringify(
    fs.readFileSync(input.path, 'utf8').split('\n').map(
      (line: string) => JSON.parse(Buffer.from(line, 'base64').toString()))));
};
