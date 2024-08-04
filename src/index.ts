import { client, createClient } from "@hey-api/client-axios";
import cli from "@/cli/index";
export * from "@/api-client";
import logger from "@/util/logger";
import env from "@/util/env";
import { AxiosError, type AxiosRequestConfig, type AxiosResponse } from "axios";

// Create the API client
createClient({
  baseURL: env.BOTHIVE_API_URL,
});

// Set auth token function
export const setAuthToken = (token: string) => {
  client.instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

// Request interceptor to set the Authorization header
client.instance.interceptors.request.use((config) => {
  config.headers.set("Authorization", `Bearer ${env.BOTHIVE_API_TOKEN}`);
  return config;
});

// Helper function to safely stringify objects for logging
const safeStringify = (obj: any): string => {
  return JSON.stringify(
    obj,
    (key, value) => {
      if (key === "Authorization") return "[REDACTED]";
      return value;
    },
    2
  );
};

// Custom error handler
const handleApiError = (error: AxiosError) => {
  if (error.response) {
    const { status, data } = error.response;
    switch (status) {
      case 401:
        logger.error("Unauthorized: Please check your API token.");
        break;
      case 403:
        logger.error(
          "Forbidden: You don't have permission to access this resource."
        );
        break;
      case 404:
        logger.error("Not Found: The requested resource does not exist.");
        break;
      case 500:
        logger.error(
          "Internal Server Error: Something went wrong on the server."
        );
        break;
      default:
        logger.error(
          `API Error (${status}): ${(data as any).message || "Unknown error"}`
        );
    }
  } else if (error.request) {
    logger.error("Network Error: Unable to reach the API server.");
  } else {
    logger.error(`Error: ${error.message}`);
  }
  return Promise.reject(error);
};

// Debug logging
if (env.LOG_LEVEL === "debug") {
  // Request logging
  client.instance.interceptors.request.use((config) => {
    logger.debug(
      `API Request: ${safeStringify({
        method: config.method?.toUpperCase(),
        url: config.url,
        headers: config.headers,
        data: config.data,
      })}`
    );
    return config;
  });

  // Response logging
  client.instance.interceptors.response.use(
    (response: AxiosResponse) => {
      logger.debug(
        `API Response: ${safeStringify({
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          data: response.data,
        })}`
      );
      return response;
    },
    (error: AxiosError) => {
      logger.debug(
        `API Error: ${safeStringify({
          message: error.message,
          response: {
            status: error.response?.status,
            statusText: error.response?.statusText,
            headers: error.response?.headers,
            data: error.response?.data,
          },
        })}`
      );
      return handleApiError(error);
    }
  );
} else {
  // Only use error handler if not in debug mode
  client.instance.interceptors.response.use(
    (response) => response,
    handleApiError
  );
}

// CLI parsing
cli.parseAsync(process.argv).catch((error) => {
  logger.error(`[CLI Error] ${error}`);
  process.exit(1);
});
