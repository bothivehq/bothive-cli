import { createClient } from "@hey-api/openapi-ts";
import axios from "axios";
import fs from "fs";
import env from "./util/env";

const BOTHIVE_API_SPEC = `${env.BOTHIVE_API_URL}/api/openapi`;

const run = async () => {
  try {
    const response = await axios.get(BOTHIVE_API_SPEC);
    const openapiSpec = response.data;
    fs.writeFileSync("bothive_api.json", JSON.stringify(openapiSpec));

    await createClient({
      client: "@hey-api/client-axios",
      input: "bothive_api.json",
      output: {
        path: "src/api-client",
        format: "prettier",
        lint: "eslint",
      },
      types: {
        dates: "types+transform",
      },
    });
  } catch (error) {
    console.error("Error generating client:", error);
  }
};

run();
