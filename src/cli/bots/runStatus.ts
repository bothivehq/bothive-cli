import { Command } from "commander";
import logger from "@/util/logger";
import { getBotRunStatus, type BotRun, type BotRunStatus } from "@/api-client";
import chalk from "chalk";
import Table from "cli-table3";
import { selectBot, selectBotRun } from "@/util/api-helpers";

const formatRunDetails = (run: BotRun): string[] => [
  run.id?.toString() || "N/A",
  run.bot_id.toString(),
  run.inserted_at || "N/A",
  JSON.stringify(run.params),
  run.result || "N/A",
];

const formatLog = (log: BotRunStatus["logs"][0]): string =>
  `[${log.timestamp}] [${log.level}] ${log.msg}`;

export const runStatusCommand = new Command("run-status")
  .description("Get the status and logs of a bot run")
  .option("-b, --bot-id <botId>", "Specify the bot ID")
  .option("-r, --run-id <runId>", "Specify the run ID")
  .action(async (options: { botId?: string; runId?: string }) => {
    const botId = options.botId
      ? parseInt(options.botId)
      : await selectBot("Select a bot to get run status for:");

    if (botId === -1) {
      return;
    }

    const runId =
      options.runId ??
      (await selectBotRun(botId, "Select a run to get status for:"));

    if (runId === null) {
      return;
    }

    try {
      const { data: status } = await getBotRunStatus({
        path: { id: botId!, run_id: runId! },
      });

      console.log(chalk.cyan(`Status for Bot ID: ${botId}, Run ID: ${runId}`));

      const runDetailsTable = new Table({
        head: ["ID", "Bot ID", "Inserted At", "Params", "Result"],
        colWidths: [10, 10, 25, 30, 30],
        wordWrap: true,
        wrapOnWordBoundary: false,
      });

      runDetailsTable.push(formatRunDetails(status.run));

      console.log(chalk.cyan("\nRun Details:"));
      console.log(runDetailsTable.toString());

      console.log(chalk.cyan("\nBot Run Logs:"));
      if (status.logs && status.logs.length > 0) {
        status.logs.forEach((log) => {
          console.log(chalk.gray(formatLog(log)));
        });
      } else {
        console.log(chalk.yellow("No logs available for this run."));
      }
    } catch (error) {
      logger.error("Error fetching bot run status and logs", { error });
      console.error(
        chalk.red(
          `Error: ${error instanceof Error ? error.message : "An unknown error occurred"}`
        )
      );
    }
  });
