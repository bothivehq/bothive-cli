import { Command } from "commander";
import logger from "@/util/logger";
import { listBotRuns } from "@/api-client";
import chalk from "chalk";
import Table from "cli-table3";
import { selectBot } from "@/util/api-helpers";

type FormattedRun = {
  ID: string;
  Status: string;
  "Start Time": string;
};

export const listRunsCommand = new Command("runs")
  .description("List all runs for a bot")
  .option("-i, --id <botId>", "Specify the bot ID to list runs for")
  .action(async (options: { id?: string }) => {
    const botId = options.id
      ? parseInt(options.id)
      : await selectBot("Select a bot to list runs for:");

    if (botId === -1) {
      return;
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
