import { Command } from "commander";
import { logoutCommand } from "./logout";
import { loginCommand } from "./login";
import { tokenCommand } from "./token";
import { whoamiCommand } from "./whoami";

export const authCommand = new Command("auth")
  .alias("a")
  .description("Authenticate with the BotHive API")
  .addCommand(loginCommand)
  .addCommand(logoutCommand)
  .addCommand(tokenCommand)
  .addCommand(whoamiCommand);
