import { Command } from "commander";
import logger from "@/util/logger";

export const tokenCommand = new Command("token")
  .description("Get token")
  .action(async (options: unknown) => {
    logger.info("Token: $token");
  });
