import { client } from "@hey-api/client-axios";
import { createClient } from "@hey-api/client-axios";
import cli from "@/cli/index";
export * from "@/api-client";
import logger from "@/logger";
import env from "@/env";

createClient({
  baseURL: env.API_BASE_URL,
});

export const setAuthToken = (token: string) => {
  client.instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

client.instance.interceptors.request.use((config) => {
  config.headers.set("Authorization", `Bearer ${env.API_TOKEN}`);
  return config;
});

if (env.LOG_LEVEL == "debug") {
  client.instance.interceptors.request.use((config) => {
    logger.debug("Request:", {
      method: config.method?.toUpperCase(),
      url: config.url,
      headers: config.headers,
      data: config.data,
    });
    return config;
  });

  client.instance.interceptors.response.use(
    (response) => {
      logger.debug("Response:", {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: response.data,
      });
      return response;
    },
    (error) => {
      logger.error("Error:", {
        message: error.message,
        response: {
          status: error.response?.status,
          statusText: error.response?.statusText,
          headers: error.response?.headers,
          data: error.response?.data,
        },
      });
      return Promise.reject(error);
    }
  );
}

cli.parseAsync(process.argv).catch((error) => {
  logger.error("[failed]", String(error));
  process.exit(1);
});
