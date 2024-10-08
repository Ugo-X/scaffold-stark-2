#!/usr/bin/env node
import yargs from "yargs";
import { execSync } from "child_process";

interface CommandLineOptions {
  _: string[]; // Non-hyphenated arguments are usually under the `_` key
  $0: string; // The script name or path is under the `$0` key
  network?: string; // The --network option
  reset?: boolean;
}

const argv = yargs(process.argv.slice(2))
  .options({
    network: { type: "string" },
    reset: { type: "boolean", default: false },
  })
  .parseSync() as CommandLineOptions;

// Set the NETWORK environment variable based on the --network argument
process.env.NETWORK = argv.network || "devnet";

// Set the RESET environment variable based on the --reset flag

// Execute the deploy script
execSync(
  "cd contracts && scarb build && ts-node ../scripts-ts/deploy.ts" +
    " --network " +
    process.env.NETWORK +
    (argv.reset ? " --reset" : "") +
    " && ts-node ../scripts-ts/helpers/parse-deployments.ts" +
    " && cd ..",
  { stdio: "inherit" }
);
