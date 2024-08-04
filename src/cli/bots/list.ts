import { listBots } from "@/api-client";
import logger from "@/util/logger";
import { Command } from "commander";
import Table from "cli-table3";

export const listBotsCommand = new Command("list")
  .alias("l")
  .description("List your bots")
  .action(async () => {
    try {
      const { data: bots } = await listBots();

      if (bots.length === 0) {
        logger.info("No bots found");
      } else {
        const table = new Table({
          head: ["ID", "Name", "Start Command", "Package JSON", "Script"],
          colWidths: [10, 20, 20, 30, 30],
          wordWrap: true,
        });

        bots.forEach((bot) => {
          table.push([
            bot.id?.toString() || "",
            bot.name,
            bot.package_json.substring(0, 100) + "...",
            bot.script.substring(0, 100) + "...",
          ]);
        });

        logger.info(`Found ${bots.length} bot(s)`);
        console.log(table.toString());
      }
    } catch (error: any) {
      logger.error("Error fetching bots list", { error });
    }
  });
