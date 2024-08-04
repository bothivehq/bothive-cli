import { Command } from "commander";
import logger from "@/util/logger";

export const loginCommand = new Command("login")
  .description("Authenticate user and generate bearer token")
  .requiredOption("-e, --email <email>", "User email")
  .requiredOption("-p, --password <password>", "User password")
  .action(async (options: unknown) => {
    logger.info("Logged In");
  });
