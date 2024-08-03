import { Command } from "commander";
import logger from "@/logger";
import { listBots, listBotRuns, type BotRunList } from "@/api-client";
import prompts from "prompts";
import chalk from "chalk";
import Table from "cli-table3";

type FormattedRun = {
  ID: string;
  Status: string;
  "Start Time": string;
};

export const listRunsCommand = new Command("runs")
  .description("List all runs for a bot")
  .option("-i, --id <botId>", "Specify the bot ID to list runs for")
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
        message: "Select a bot to list runs for:",
        choices: botChoices,
      });

      if (!response.selectedBot) {
        console.log(chalk.yellow("Operation canceled."));
        return;
      }

      botId = response.selectedBot;
    }

    try {
      const { data: runs } = await listBotRuns({
        path: { id: botId },
      });

      const runsArray = Array.isArray(runs) ? runs : [];
      if (runsArray.length === 0) {
        console.log(chalk.yellow("No runs found for the selected bot."));
      } else {
        const table = new Table({
          head: ["ID", "Start Time", "Status"],
          wordWrap: true,
          wrapOnWordBoundary: false,
          style: {
            head: ["cyan"],
            border: ["gray"],
          },
        });

        runsArray.forEach((run) => {
          table.push([run.id?.toString() || "", run.inserted_at, run.result]);
        });

        console.log(table.toString());
      }
    } catch (error: any) {
      logger.error("Error listing bot runs", { error });
      console.error(
        chalk.red(
          `Error: ${error instanceof Error ? error.message : "An unknown error occurred"}`
        )
      );
    }
  });
