import { Command } from "commander";
import logger from "@/util/logger";

export const logoutCommand = new Command("logout")
  .description("Logout")
  .action(async (options: unknown) => {
    logger.info("Logged Out");
  });
