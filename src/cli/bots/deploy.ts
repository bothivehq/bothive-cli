import { Command } from "commander";
import logger from "@/util/logger";
import * as fs from "fs-extra";
import * as path from "path";
import { deployBot } from "@/api-client";
import { bundleCode, ensureDirectory, cleanupFile } from "@/util";

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

      if (!fs.existsSync(options.entry)) {
        throw new Error(`Entry file ${options.entry} does not exist`);
      }

      const tmpDir = path.join(process.cwd(), ".bothive");
      const outFile = path.join(tmpDir, "index.cjs");

      await ensureDirectory(tmpDir);

      await bundleCode({
        entry: options.entry,
        outDir: tmpDir,
        outFile: outFile,
      });

      const bundledCode = await fs.readFile(outFile, "utf-8");

      const packageJsonPath = path.join(process.cwd(), "package.json");
      const packageJson = await fs.readJSON(packageJsonPath);

      const botData = {
        name: packageJson.name,
        package_json: JSON.stringify(packageJson),
        script: bundledCode,
        start_command: `node index.cjs`,
      };

      await deployBot({ body: botData });
      logger.info(`Bot '${packageJson.name}' deployed successfully`);
    } catch (error) {
      logger.error("Error deploying bot", { error });
      console.error(
        `Error: ${error instanceof Error ? error.message : "An unknown error occurred"}`
      );
    } finally {
      await cleanupFile(path.join(process.cwd(), ".bothive", "index.cjs"));
    }
  });
