import pino from "pino";
import env from "@/util/env";

const logger = pino({
  level: env.LOG_LEVEL || "info",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
});

export default logger;
