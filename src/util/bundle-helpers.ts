import * as fs from "fs-extra";
import * as path from "path";
import { execSync } from "child_process";
import { createInterface } from "readline";
import { build } from "tsup";
import logger from "./logger";

type BundleOptions = {
  entry: string;
  outDir: string;
  outFile: string;
};

export const ensureDirectory = async (dir: string): Promise<void> => {
  try {
    await fs.ensureDir(dir);
    logger.info(`Directory ensured: ${dir}`);
  } catch (error) {
    throw new Error(
      `Failed to ensure directory: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
};

export const bundleCode = async (options: BundleOptions): Promise<void> => {
  try {
    await build({
      entry: [options.entry],
      outDir: options.outDir,
      format: "cjs",
      minify: true,
      platform: "node",
      target: "node20",
      bundle: true,
    });
    logger.info("Code bundled successfully");
  } catch (error) {
    throw new Error(
      `Failed to bundle code: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
};

export const getUserConfirmation = async (prompt: string): Promise<boolean> => {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(`${prompt} (y/N): `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() !== "n");
    });
  });
};

export const executeScript = (scriptPath: string): void => {
  try {
    logger.info("Running bundled script");
    execSync(`node --experimental-modules ${scriptPath}`, { stdio: "inherit" });
    logger.info("Script execution completed");
  } catch (error) {
    throw new Error(
      `Failed to execute script: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
};

export const cleanupFile = async (filePath: string): Promise<void> => {
  try {
    await fs.remove(filePath);
    logger.info(`Cleaned up file: ${filePath}`);
  } catch (error) {
    logger.warn(`Failed to clean up file: ${filePath}`, { error });
  }
};

export const bundleAndRunCode = async (entryPoint: string): Promise<void> => {
  const tmpDir = path.join(process.cwd(), ".bothive");
  const outFile = path.join(tmpDir, "index.cjs");

  try {
    await ensureDirectory(tmpDir);

    await bundleCode({
      entry: entryPoint,
      outDir: tmpDir,
      outFile: outFile,
    });

    const userConfirmed = await getUserConfirmation(
      "Do you want to execute the bundled script?"
    );

    if (userConfirmed) {
      executeScript(outFile);
    } else {
      logger.info("Script execution cancelled by user");
    }
  } catch (error) {
    throw new Error(
      `Failed to process or run code: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  } finally {
    await cleanupFile(outFile);
  }
};
