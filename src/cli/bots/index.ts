import { Command } from "commander";
import { listBotsCommand } from "./list";
import { deployBotCommand } from "./deploy";
import { destroyBotCommand } from "./destroy";
import { runBotCommand } from "./run";
import { listRunsCommand } from "./listRuns";
import { showBotCommand } from "./show";
import { runStatusCommand } from "./runStatus";

export const botCommand = new Command("bots")
  .alias("bot")
  .alias("b")
  .description("Manage your bots on BotHive")
  .addCommand(listBotsCommand)
  .addCommand(showBotCommand)
  .addCommand(deployBotCommand)
  .addCommand(destroyBotCommand)
  .addCommand(listRunsCommand)
  .addCommand(runBotCommand)
  .addCommand(runStatusCommand);
