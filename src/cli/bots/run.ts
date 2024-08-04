import { Command } from "commander";
import logger from "@/util/logger";
import { listBots, triggerBotRun } from "@/api-client";
import prompts from "prompts";
import chalk from "chalk";

export const runBotCommand = new Command("run")
  .alias("trigger")
  .description("Run a Bot")
  .option("-i, --id <botId>", "Specify the bot ID to run")
  .option(
    "-p, --param <key=value...>",
    "Add multiple parameters as key=value pairs",
    []
  )
  .action(async (options: { id?: string; param: string[] }) => {
    const runBot = async (
      botId: number,
      params: Record<string, string>
    ): Promise<void> => {
      const paramString = Object.entries(params)
        .map(([key, value]) => `${key}=${value}`)
        .join(", ");
      console.log(
        chalk.cyan(`Running bot ${botId} with parameters: ${paramString}`)
      );

      try {
        const { data: runResponse } = await triggerBotRun({
          path: { id: botId },
          body: { params },
        });
        console.log(chalk.green("Bot run initiated successfully."));
        // console.log(chalk.cyan("Run ID:"), runResponse.id);
        // console.log(chalk.cyan("Status:"), runResponse.status);
      } catch (error) {
        logger.error("Error running bot", { error });
        console.error(
          chalk.red(
            `Error: ${error instanceof Error ? error.message : "An unknown error occurred"}`
          )
        );
      }
    };

    const parsedParams = options.param.reduce(
      (acc, param) => {
        const [key, value] = param.split("=");
        if (key && value) {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, string>
    );

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
        message: "Select a bot to run:",
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

    await runBot(botId!, parsedParams);
  });
