import { Command } from "commander";
import { authCommand } from "./auth";
import { botCommand } from "./bots";
import { hideCommandHelpAliases } from "@/util";

const HELP_REPLACEMENTS = {
  "version|v": "version",
  "bots|bot": "bots    ",
  "auth|a": "auth  ",
  "list|l": "list  ",
  "logs|log": "logs    ",
};

const cli = new Command()
  .description("CLI tool for interacting with BotHive API")
  .configureHelp({ showGlobalOptions: true })
  .option("--verbose", "Enable verbose mode")
  .option("--debug", "Enable debug mode")
  .addCommand(
    new Command("version").alias("v").action(async () => {
      const packageJson = require("../../package.json");
      console.log(`Version: ${packageJson.version}`);
      process.exit(0);
    })
  )
  .addCommand(hideCommandHelpAliases(botCommand, HELP_REPLACEMENTS));
// No auth this version - set your environment variables
// .addCommand(hideCommandHelpAliases(authCommand, HELP_REPLACEMENTS));

hideCommandHelpAliases(cli, HELP_REPLACEMENTS);

export default cli;
