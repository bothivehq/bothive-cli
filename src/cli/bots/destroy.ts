import { Command } from "commander";
import logger from "@/logger";
import { listBots, deleteBot } from "@/api-client";
import prompts from "prompts";
import chalk from "chalk";

export const destroyBotCommand = new Command("destroy")
  .description("Destroy a Bot")
  .option("-i, --id <botId>", "Specify the bot ID to destroy")
  .action(async (options: { id?: string }) => {
    let botId: number = options.id ? parseInt(options.id) : -1;

    if (botId === -1) {
      const { data: bots } = await listBots();

      if (bots.length === 0) {
        console.log(chalk.yellow("No bots found."));
        return;
      }

      const botChoices = bots.map((bot) => ({
        title: `${bot.name} (ID: ${bot.id})`,
        value: bot.id,
      }));

      const response = await prompts({
        type: "select",
        name: "selectedBot",
        message: "Select a bot to destroy:",
        choices: botChoices,
      });

      if (!response.selectedBot) {
        console.log(chalk.yellow("Operation canceled."));
        return;
      }

      botId = response.selectedBot;
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
