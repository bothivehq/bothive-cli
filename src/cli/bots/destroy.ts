import { Command } from "commander";
import logger from "@/util/logger";
import { deleteBot } from "@/api-client";
import chalk from "chalk";
import { selectBot } from "@/util";

export const destroyBotCommand = new Command("destroy")
  .description("Destroy a Bot")
  .option("-i, --id <botId>", "Specify the bot ID to destroy")
  .action(async (options: { id?: string }) => {
    const botId = options.id
      ? parseInt(options.id)
      : await selectBot("Select a bot to destroy:");

    if (botId === -1) {
      return;
    }

    try {
      await deleteBot({ path: { id: botId } });
      console.log(
        chalk.green(`Bot with ID ${botId} has been destroyed successfully.`)
      );
    } catch (error: any) {
      logger.error("Error destroying bot", { error });
      console.error(
        chalk.red(
          `Error: ${error instanceof Error ? error.message : "An unknown error occurred"}`
        )
      );
    }
  });
