import fs from "fs";
import path from "path";
import type { Command } from "commander";
import { z } from "znv";

const botSchema = z.object({
  name: z.string(),
  script: z.string(),
  start_command: z.string(),
});

export const readPackageJson = (): z.infer<typeof botSchema> | null => {
  const packagePath = path.join(process.cwd(), "package.json");
  if (!fs.existsSync(packagePath)) {
    console.error("package.json not found in the current directory");
    return null;
  }

  try {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf-8"));
    return botSchema.parse({
      name: packageJson.name,
      script: packageJson.main,
      start_command: packageJson.scripts?.start || `node ${packageJson.main}`,
    });
  } catch (error) {
    console.error("Error parsing package.json:", error);
    return null;
  }
};

export function hideCommandHelpAliases(
  command: Command,
  replacements: Record<any, string>
): Command {
  const originalHelpInformation = command.helpInformation;
  command.helpInformation = function (this: Command): string {
    let helpInfo = originalHelpInformation.call(this);
    for (const [search, replacement] of Object.entries(replacements)) {
      helpInfo = helpInfo.replace(search, replacement);
    }
    return helpInfo;
  };
  return command;
}
