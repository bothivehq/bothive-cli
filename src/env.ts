import { z, parseEnv } from "znv";
import dotenv from "dotenv";

dotenv.config();

const env = parseEnv(process.env, {
  LOG_LEVEL: z.string().optional().default("info"),
  NODE_ENV: z.string().optional().default("development"),
  API_BASE_URL: z.string().url().default("https://bothive.xyz"),
  API_TOKEN: z.string().optional().default(""),
});

if (env.LOG_LEVEL === "debug") {
  console.log("Current environment variables:");
  console.log(`LOG_LEVEL: ${env.LOG_LEVEL}`);
  console.log(`NODE_ENV: ${env.NODE_ENV}`);
  console.log(`API_BASE_URL: ${env.API_BASE_URL}`);
  console.log(`API_TOKEN: ${env.API_TOKEN}`);
}

export default env;
