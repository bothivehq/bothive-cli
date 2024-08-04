import type { Command } from "commander";
import chalk from "chalk";
import prompts from "prompts";
import { listBots, listBotRuns, type BotRun } from "@/api-client";

export function hideCommandHelpAliases(
  command: Command,
  replacements: Record<any, string>
): Command {
  const originalHelpInformation = command.helpInformation;
  command.helpInformation = function (this: Command): string {
    let helpInfo = originalHelpInformation.call(this);
    for (const [search, replacement] of Object.entries(replacements)) {
      helpInfo = helpInfo.replace(search, replacement);
    }
    return helpInfo;
  };
  return command;
}

export async function selectBot(message: string): Promise<number> {
  const { data: bots } = await listBots();

  if (bots.length === 0) {
    console.log(chalk.yellow("No bots found."));
    return -1;
  }

  const botChoices = bots.map((bot) => ({
    title: `${bot.name} (ID: ${bot.id})`,
    value: bot.id,
  }));

  const response = await prompts({
    type: "select",
    name: "selectedBot",
    message,
    choices: botChoices,
  });

  if (!response.selectedBot) {
    console.log(chalk.yellow("Operation canceled."));
    return -1;
  }

  return response.selectedBot;
}

export async function selectBotRun(
  botId: number,
  message: string = "Select a run:"
): Promise<string | null> {
  const { data: runs } = await listBotRuns({ path: { id: botId } });

  if (Object.keys(runs).length === 0) {
    console.log(chalk.yellow("No runs found for the selected bot."));
    return null;
  }

  const runResponse = await prompts({
    type: "select",
    name: "selectedRun",
    message,
    choices: Object.entries(runs).map(([id, run]) => ({
      title: `Run ID: ${(run as BotRun).id}, Inserted At: ${(run as BotRun).inserted_at}`,
      value: (run as BotRun).id,
    })),
  });

  if (!runResponse.selectedRun) {
    console.log(chalk.yellow("Operation canceled."));
    return null;
  }

  return runResponse.selectedRun;
}
