import { listBots, showBot, type Bot } from "@/api-client";
import logger from "@/logger";
import { Command } from "commander";
import chalk from "chalk";
import Table from "cli-table3";
import prompts from "prompts";

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
      let botId = options.id ? parseInt(options.id) : undefined;

      if (!botId) {
        const { data: bots } = await listBots();
        if (bots.length === 0) {
          console.log(chalk.yellow("No bots found."));
          return;
        }

        const botResponse = await prompts({
          type: "select",
          name: "selectedBot",
          message: "Select a bot:",
          choices: bots.map((bot) => ({
            title: `${bot.name} (ID: ${bot.id})`,
            value: bot.id,
          })),
        });

        if (!botResponse.selectedBot) {
          console.log(chalk.yellow("Operation canceled."));
          return;
        }

        botId = botResponse.selectedBot;
      }

      if (botId === undefined) {
        console.log(chalk.yellow("No bot selected. Operation canceled."));
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
