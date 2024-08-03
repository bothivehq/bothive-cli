import { Command } from "commander";
import logger from "@/logger";

export const tokenCommand = new Command("token")
  .description("Get token")
  .action(async (options: unknown) => {
    logger.info("Token: $token");
  });
