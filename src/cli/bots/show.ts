import { listBots, showBot, type Bot } from "@/api-client";
import logger from "@/util/logger";
import { Command } from "commander";
import chalk from "chalk";
import Table from "cli-table3";
import prompts from "prompts";
import { selectBot } from "@/util";

const formatBotStatus = (bot: Bot): string[] => [
  bot.id?.toString() || "N/A",
  bot.name || "N/A",
  bot.script?.substring(0, 2000) || "N/A",
  bot.package_json?.substring(0, 2000) || "N/A",
];

export const showBotCommand = new Command("show")
  .description("Show bot details")
  .option("-i, --id <botId>", "Specify the bot ID")
  .action(async (options: { id?: string }) => {
    logger.info("Getting bot status", { options });
    try {
      const botId = options.id
        ? parseInt(options.id)
        : await selectBot("Select a bot to get run status for:");

      if (botId === -1) {
        return;
      }

      const { data: bot } = await showBot({ path: { id: botId } });

      const table = new Table({
        head: ["ID", "Name", "Script", "Package JSON"],
        wordWrap: true,
        wrapOnWordBoundary: false,
        style: {
          head: ["cyan"],
          border: ["gray"],
        },
      });

      table.push(formatBotStatus(bot));

      console.log(table.toString());
    } catch (error) {
      logger.error("Error fetching bot status", { error });
      console.error(
        chalk.red(
          `Error: ${error instanceof Error ? error.message : "An unknown error occurred"}`
        )
      );
    }
  });
