import { Command } from "commander";
import logger from "@/logger";
import {
  listBots,
  listBotRuns,
  getBotRunStatus,
  type BotRun,
  type BotRunStatus,
} from "@/api-client";
import prompts from "prompts";
import chalk from "chalk";
import Table from "cli-table3";

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
    let botId = options.botId ? parseInt(options.botId) : undefined;
    let runId = options.runId;

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

    if (!runId) {
      const { data: runs } = await listBotRuns({ path: { id: botId! } });
      if (Object.keys(runs).length === 0) {
        console.log(chalk.yellow("No runs found for the selected bot."));
        return;
      }

      const runResponse = await prompts({
        type: "select",
        name: "selectedRun",
        message: "Select a run:",
        choices: Object.entries(runs).map(([id, run]) => ({
          title: `Run ID: ${(run as BotRun).id}, Inserted At: ${(run as BotRun).inserted_at}`,
          value: (run as BotRun).id,
        })),
      });

      if (!runResponse.selectedRun) {
        console.log(chalk.yellow("Operation canceled."));
        return;
      }

      runId = runResponse.selectedRun;
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
