import { Command } from "commander";
import logger from "@/logger";

export const whoamiCommand = new Command("whoami")
  .description("Get user info")
  .action(async (options: unknown) => {
    logger.info("Who am I");
  });
