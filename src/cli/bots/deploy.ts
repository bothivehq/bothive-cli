import { Command } from "commander";
import logger from "@/logger";
import * as esbuild from "esbuild";
import * as fs from "fs-extra";
import * as path from "path";
import { deployBot } from "@/api-client";

export const deployBotCommand = new Command("deploy")
  .description("Deploy your bot")
  .option(
    "-e, --entry <file>",
    "Entry file for the bot (default: src/index.ts)",
    "src/index.ts"
  )
  .action(async (options: { entry: string }) => {
    try {
      logger.info("Starting bot deployment process");

      // Ensure the entry file exists
      if (!fs.existsSync(options.entry)) {
        throw new Error(`Entry file ${options.entry} does not exist`);
      }

      // Read package.json
      const packageJsonPath = path.join(process.cwd(), "package.json");
      const packageJson = await fs.readJSON(packageJsonPath);

      // Bundle the code
      const result = await esbuild.build({
        entryPoints: [options.entry],
        bundle: true,
        minify: true,
        platform: "node",
        target: "node14",
        write: false, // Don't write to disk, we want the content as a string
      });

      if (result.outputFiles && result.outputFiles.length > 0) {
        const bundledCode = result.outputFiles[0].text;

        // Prepare the bot data
        const botData = {
          name: packageJson.name,
          package_json: JSON.stringify(packageJson),
          script: bundledCode,
          start_command: `node ${path.basename(options.entry)}`,
        };

        // Deploy the bot
        await deployBot({ body: botData });
        logger.info(`Bot '${packageJson.name}' deployed successfully`);
      } else {
        throw new Error("Failed to generate bundled code");
      }
    } catch (error) {
      logger.error("Error deploying bot", { error });
      console.error(
        `Error: ${error instanceof Error ? error.message : "An unknown error occurred"}`
      );
    }
  });
