import { z, parseEnv } from "znv";
import dotenv from "dotenv";

dotenv.config();

const env = parseEnv(process.env, {
  LOG_LEVEL: z.string().optional().default("info"),
  NODE_ENV: z.string().optional().default("development"),
  BOTHIVE_API_URL: z.string().url().default("https://bothive.xyz"),
  BOTHIVE_API_TOKEN: z.string().optional().default(""),
});

// Cannot use logging here because it will cause a circular dependency
if (env.LOG_LEVEL === "debug") {
  console.log("Current environment variables:");
  console.log(`  LOG_LEVEL: ${env.LOG_LEVEL}`);
  console.log(`  NODE_ENV: ${env.NODE_ENV}`);
  console.log(`  BOTHIVE_API_URL: ${env.BOTHIVE_API_URL}`);
  console.log(`  BOTHIVE_API_TOKEN: ${env.BOTHIVE_API_TOKEN}`);
}

export default env;
