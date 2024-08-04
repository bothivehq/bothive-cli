import { Command } from "commander";
import logger from "@/util/logger";
import * as fs from "fs-extra";
import { bundleAndRunCode } from "@/util";

export const testBotCommand = new Command("test")
  .description("Test your bot locally")
  .option(
    "-e, --entry <file>",
    "Entry file for the bot (default: src/index.ts)",
    "src/index.ts"
  )
  .action(async (options: { entry: string }) => {
    try {
      logger.info("Starting bot test process");

      if (!fs.existsSync(options.entry)) {
        throw new Error(`Entry file ${options.entry} does not exist`);
      }

      await bundleAndRunCode(options.entry);
      logger.info("Bot test process completed");
    } catch (error) {
      logger.error("Error testing bot", { error });
      console.error(
        `Error: ${error instanceof Error ? error.message : "An unknown error occurred"}`
      );
    }
  });
