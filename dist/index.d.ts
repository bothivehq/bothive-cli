import * as _hey_api_client_axios from '@hey-api/client-axios';
import { Options } from '@hey-api/client-axios';

declare const $AuthResponse: {
    readonly description: "Successful authentication response";
    readonly example: {
        readonly token: "vW4sIvFvqkw6iogdhNyyFXa2nKg4LlsVobOTR721hbs";
        readonly token_type: "bearer";
    };
    readonly properties: {
        readonly token: {
            readonly description: "Token";
            readonly type: "string";
        };
        readonly token_type: {
            readonly description: "Token Type";
            readonly type: "string";
        };
    };
    readonly required: readonly ["token", "token_type"];
    readonly title: "AuthResponse";
    readonly type: "object";
};
declare const $Bot: {
    readonly description: "Schema for a Bot";
    readonly example: {
        readonly id: 1;
        readonly name: "Example Bot";
        readonly package_json: "{}";
        readonly script: "console.log('Hello, world!')";
    };
    readonly properties: {
        readonly id: {
            readonly description: "Bot ID";
            readonly type: "integer";
        };
        readonly name: {
            readonly description: "Unique bot name";
            readonly type: "string";
        };
        readonly package_json: {
            readonly description: "Package JSON of the bot";
            readonly type: "string";
        };
        readonly script: {
            readonly description: "Script of the bot";
            readonly type: "string";
        };
    };
    readonly required: readonly ["name", "package_json", "script", "start_command"];
    readonly title: "Bot";
    readonly type: "object";
};
declare const $BotDeployParams: {
    readonly description: "Schema for deploying a Bot";
    readonly example: {
        readonly name: "Example Bot";
        readonly package_json: "{}";
        readonly script: "console.log('Hello, world!')";
    };
    readonly properties: {
        readonly name: {
            readonly description: "Name of the bot";
            readonly type: "string";
        };
        readonly package_json: {
            readonly description: "Package JSON of the bot";
            readonly type: "string";
        };
        readonly script: {
            readonly description: "Script of the bot";
            readonly type: "string";
        };
    };
    readonly required: readonly ["name", "package_json", "script"];
    readonly title: "BotDeployParams";
    readonly type: "object";
};
declare const $BotList: {
    readonly description: "List of Bots";
    readonly example: readonly [{
        readonly id: 1;
        readonly name: "Example Bot";
        readonly package_json: "{ name: 'Example Bot' }";
        readonly script: "console.log('Hello, world!')";
    }, {
        readonly id: 2;
        readonly name: "Example Bot 2";
        readonly package_json: "{ name: 'Example Bot 2' }";
        readonly script: "console.log('Hello, world!')";
    }];
    readonly items: {
        readonly $ref: "#/components/schemas/Bot";
    };
    readonly title: "BotList";
    readonly type: "array";
};
declare const $BotRun: {
    readonly description: "Trigger a Bot run";
    readonly example: {
        readonly bot_id: 1;
        readonly id: "223e4567-e89b-12d3-a456-426614174001";
        readonly inserted_at: "2023-06-15T11:00:00Z";
        readonly params: {
            readonly param1: "value3";
            readonly param2: "value4";
        };
        readonly result: "running";
    };
    readonly properties: {
        readonly bot_id: {
            readonly description: "Bot ID";
            readonly type: "integer";
        };
        readonly id: {
            readonly description: "Bot run ID";
            readonly type: "string";
        };
        readonly inserted_at: {
            readonly description: "Timestamp when the run was created";
            readonly type: "string";
        };
        readonly params: {
            readonly description: "Params used for the Bot run";
            readonly type: "map";
        };
        readonly result: {
            readonly description: "Result of the Bot run";
            readonly type: "string";
        };
    };
    readonly required: readonly ["bot_id", "params"];
    readonly title: "BotRun";
    readonly type: "object";
};
declare const $BotRunList: {
    readonly description: "A list of Bot runs";
    readonly example: readonly [{
        readonly bot_id: 1;
        readonly id: "123e4567-e89b-12d3-a456-426614174000";
        readonly inserted_at: "2023-06-15T10:00:00Z";
        readonly params: {
            readonly param1: "value1";
            readonly param2: "value2";
        };
        readonly result: "success";
    }, {
        readonly bot_id: 1;
        readonly id: "223e4567-e89b-12d3-a456-426614174001";
        readonly inserted_at: "2023-06-15T11:00:00Z";
        readonly params: {
            readonly param1: "value3";
            readonly param2: "value4";
        };
        readonly result: "running";
    }];
    readonly items: {
        readonly $ref: "#/components/schemas/BotRun";
    };
    readonly title: "BotRunList";
    readonly type: "object";
};
declare const $BotRunParams: {
    readonly description: "Parameters for triggering a Bot run";
    readonly example: {
        readonly params: {
            readonly key1: "value1";
            readonly key2: "value2";
            readonly key3: "value3";
        };
    };
    readonly properties: {
        readonly params: {
            readonly additionalProperties: {
                readonly type: "string";
            };
            readonly description: "Optional key-value pairs of parameters for the Bot run";
            readonly type: "object";
        };
    };
    readonly title: "BotRunParams";
    readonly type: "object";
};
declare const $BotRunStatus: {
    readonly description: "Status of a Bot run including run details and logs";
    readonly example: {
        readonly logs: readonly [{
            readonly level: "info";
            readonly msg: "Bot run started";
            readonly timestamp: "2023-06-15T11:00:01Z";
        }, {
            readonly level: "debug";
            readonly msg: "Processing input parameters";
            readonly timestamp: "2023-06-15T11:00:02Z";
        }];
        readonly run: {
            readonly bot_id: 1;
            readonly id: "223e4567-e89b-12d3-a456-426614174001";
            readonly inserted_at: "2023-06-15T11:00:00Z";
            readonly params: {
                readonly param1: "value3";
                readonly param2: "value4";
            };
            readonly result: "running";
        };
    };
    readonly properties: {
        readonly logs: {
            readonly description: "List of logs for the Bot run";
            readonly items: {
                readonly properties: {
                    readonly level: {
                        readonly description: "Log level";
                        readonly enum: readonly ["info", "debug"];
                        readonly type: "string";
                    };
                    readonly msg: {
                        readonly description: "Log message";
                        readonly type: "string";
                    };
                    readonly timestamp: {
                        readonly description: "Timestamp when the log was created";
                        readonly format: "date-time";
                        readonly type: "string";
                    };
                };
                readonly required: readonly ["level", "msg", "timestamp"];
                readonly type: "object";
            };
            readonly type: "array";
        };
        readonly run: {
            readonly $ref: "#/components/schemas/BotRun";
        };
    };
    readonly required: readonly ["run", "logs"];
    readonly title: "BotRunStatus";
    readonly type: "object";
};
declare const $UserCredentials: {
    readonly description: "Request body for user credentials";
    readonly example: {
        readonly email: "admin@example.com";
        readonly password: "password";
    };
    readonly properties: {
        readonly email: {
            readonly description: "Email address";
            readonly format: "email";
            readonly type: "string";
        };
        readonly password: {
            readonly description: "Password";
            readonly format: "password";
            readonly type: "string";
        };
    };
    readonly required: readonly ["name", "email"];
    readonly title: "UserCredentials";
    readonly type: "object";
};

/**
 * Successful authentication response
 */
type AuthResponse = {
    /**
     * Token
     */
    token: string;
    /**
     * Token Type
     */
    token_type: string;
};
/**
 * Schema for a Bot
 */
type Bot = {
    /**
     * Bot ID
     */
    id?: number;
    /**
     * Unique bot name
     */
    name: string;
    /**
     * Package JSON of the bot
     */
    package_json: string;
    /**
     * Script of the bot
     */
    script: string;
};
/**
 * Schema for deploying a Bot
 */
type BotDeployParams = {
    /**
     * Name of the bot
     */
    name: string;
    /**
     * Package JSON of the bot
     */
    package_json: string;
    /**
     * Script of the bot
     */
    script: string;
};
/**
 * List of Bots
 */
type BotList = Array<Bot>;
/**
 * Trigger a Bot run
 */
type BotRun = {
    /**
     * Bot ID
     */
    bot_id: number;
    /**
     * Bot run ID
     */
    id?: string;
    /**
     * Timestamp when the run was created
     */
    inserted_at?: string;
    /**
     * Params used for the Bot run
     */
    params: {
        [key: string]: string;
    };
    /**
     * Result of the Bot run
     */
    result?: string;
};
/**
 * A list of Bot runs
 */
type BotRunList = {
    [key: string]: unknown;
};
/**
 * Parameters for triggering a Bot run
 */
type BotRunParams = {
    /**
     * Optional key-value pairs of parameters for the Bot run
     */
    params?: {
        [key: string]: string;
    };
};
/**
 * Status of a Bot run including run details and logs
 */
type BotRunStatus = {
    /**
     * List of logs for the Bot run
     */
    logs: Array<{
        /**
         * Log level
         */
        level: "info" | "debug";
        /**
         * Log message
         */
        msg: string;
        /**
         * Timestamp when the log was created
         */
        timestamp: Date;
    }>;
    run: BotRun;
};
/**
 * Request body for user credentials
 */
type UserCredentials = {
    /**
     * Email address
     */
    email: string;
    /**
     * Password
     */
    password?: string;
};
type ListBotsResponse = BotList;
type ListBotsError = {
    [key: string]: unknown;
};
type DeployBotData = {
    /**
     * Bot Params
     */
    body: BotDeployParams;
};
type DeployBotResponse = Bot;
type DeployBotError = {
    [key: string]: unknown;
} & unknown;
type DeleteBotData = {
    path: {
        /**
         * Bot ID
         */
        id: number;
    };
};
type DeleteBotResponse = void;
type DeleteBotError = {
    [key: string]: unknown;
} & unknown;
type ShowBotData = {
    path: {
        /**
         * Bot ID
         */
        id: number;
    };
};
type ShowBotResponse = Bot;
type ShowBotError = {
    [key: string]: unknown;
} & unknown;
type ListBotRunsData = {
    path: {
        /**
         * Bot ID
         */
        id: number;
    };
};
type ListBotRunsResponse = BotRunList;
type ListBotRunsError = {
    [key: string]: unknown;
} & unknown;
type TriggerBotRunData = {
    /**
     * Bot Run Params
     */
    body?: BotRunParams;
    path: {
        /**
         * Bot ID
         */
        id: number;
    };
};
type TriggerBotRunResponse = BotRun;
type TriggerBotRunError = {
    [key: string]: unknown;
} & unknown;
type GetBotRunStatusData = {
    path: {
        /**
         * Bot ID
         */
        id: number;
        /**
         * Run ID
         */
        run_id: string;
    };
};
type GetBotRunStatusResponse = BotRunStatus;
type GetBotRunStatusError = {
    [key: string]: unknown;
} & unknown;
type AuthenticateUserData = {
    /**
     * User credentials
     */
    body?: UserCredentials;
};
type AuthenticateUserResponse = AuthResponse;
type AuthenticateUserError = {
    [key: string]: unknown;
};
type $OpenApiTs = {
    "/api/bot": {
        get: {
            res: {
                /**
                 * Bot List Response
                 */
                "200": BotList;
                /**
                 * Unauthorised
                 */
                "401": {
                    [key: string]: unknown;
                };
            };
        };
        post: {
            req: DeployBotData;
            res: {
                /**
                 * Deployed bot
                 */
                "200": Bot;
                /**
                 * Unauthorised
                 */
                "401": {
                    [key: string]: unknown;
                };
                /**
                 * Name already exists
                 */
                "409": unknown;
                /**
                 * Unprocessable Entity
                 */
                "422": {
                    [key: string]: unknown;
                };
            };
        };
    };
    "/api/bot/{id}": {
        delete: {
            req: DeleteBotData;
            res: {
                /**
                 * Bot Deleted
                 */
                "204": void;
                /**
                 * Unauthorised
                 */
                "401": {
                    [key: string]: unknown;
                };
                /**
                 * Not Found
                 */
                "404": unknown;
            };
        };
        get: {
            req: ShowBotData;
            res: {
                /**
                 * Bot Details
                 */
                "200": Bot;
                /**
                 * Unauthorised
                 */
                "401": {
                    [key: string]: unknown;
                };
                /**
                 * Not Found
                 */
                "404": unknown;
            };
        };
    };
    "/api/bot/{id}/run": {
        get: {
            req: ListBotRunsData;
            res: {
                /**
                 * Bot Runs
                 */
                "200": BotRunList;
                /**
                 * Unauthorised
                 */
                "401": {
                    [key: string]: unknown;
                };
                /**
                 * Not Found
                 */
                "404": unknown;
            };
        };
        post: {
            req: TriggerBotRunData;
            res: {
                /**
                 * Bot Run
                 */
                "200": BotRun;
                /**
                 * Unauthorised
                 */
                "401": {
                    [key: string]: unknown;
                };
                /**
                 * Not Found
                 */
                "404": unknown;
                /**
                 * Unprocessable Entity
                 */
                "422": {
                    [key: string]: unknown;
                };
            };
        };
    };
    "/api/bot/{id}/run/{run_id}": {
        get: {
            req: GetBotRunStatusData;
            res: {
                /**
                 * Bot Run Status
                 */
                "200": BotRunStatus;
                /**
                 * Unauthorised
                 */
                "401": {
                    [key: string]: unknown;
                };
                /**
                 * Not Found
                 */
                "404": unknown;
            };
        };
    };
    "/api/login": {
        post: {
            req: AuthenticateUserData;
            res: {
                /**
                 * Authenticated response
                 */
                "200": AuthResponse;
                /**
                 * Unauthorised
                 */
                "401": {
                    [key: string]: unknown;
                };
            };
        };
    };
};

/**
 * List Bots
 * Retrieve a list of the user's Bots
 */
declare const listBots: (options?: Options) => _hey_api_client_axios.RequestResult<BotList, ListBotsError>;
/**
 * Deploy Bot
 * Deploy a Bot
 */
declare const deployBot: (options: Options<DeployBotData>) => _hey_api_client_axios.RequestResult<Bot, {
    [key: string]: unknown;
}>;
/**
 * Delete Bot
 * Delete an existing Bot by ID and it's associated runs
 */
declare const deleteBot: (options: Options<DeleteBotData>) => _hey_api_client_axios.RequestResult<void, {
    [key: string]: unknown;
}>;
/**
 * Get a Bot
 * Retrieve details of a specific Bot by ID
 */
declare const showBot: (options: Options<ShowBotData>) => _hey_api_client_axios.RequestResult<Bot, {
    [key: string]: unknown;
}>;
/**
 * List Bot Runs
 * Retrieve a list of runs for a specific bot
 */
declare const listBotRuns: (options: Options<ListBotRunsData>) => _hey_api_client_axios.RequestResult<BotRunList, {
    [key: string]: unknown;
}>;
/**
 * Trigger a Bot Run
 * Start a new run for a specific bot
 */
declare const triggerBotRun: (options: Options<TriggerBotRunData>) => _hey_api_client_axios.RequestResult<BotRun, {
    [key: string]: unknown;
}>;
/**
 * Get Bot Run Status
 * Retrieve the status of a specific bot run
 */
declare const getBotRunStatus: (options: Options<GetBotRunStatusData>) => _hey_api_client_axios.RequestResult<BotRunStatus, {
    [key: string]: unknown;
}>;
/**
 * Authenticate user
 * Authenticate user and generate bearer token
 */
declare const authenticateUser: (options?: Options<AuthenticateUserData>) => _hey_api_client_axios.RequestResult<AuthResponse, AuthenticateUserError>;
/**
 * Logout user
 * Logout user
 */
declare const logoutUser: (options?: Options) => _hey_api_client_axios.RequestResult<void, unknown>;
/**
 * Get user token
 * Get user token
 */
declare const getUserToken: (options?: Options) => _hey_api_client_axios.RequestResult<void, unknown>;
/**
 * Get user information
 * Get user information
 */
declare const getUserInfo: (options?: Options) => _hey_api_client_axios.RequestResult<void, unknown>;

declare const setAuthToken: (token: string) => void;

export { $AuthResponse, $Bot, $BotDeployParams, $BotList, $BotRun, $BotRunList, $BotRunParams, $BotRunStatus, type $OpenApiTs, $UserCredentials, type AuthResponse, type AuthenticateUserData, type AuthenticateUserError, type AuthenticateUserResponse, type Bot, type BotDeployParams, type BotList, type BotRun, type BotRunList, type BotRunParams, type BotRunStatus, type DeleteBotData, type DeleteBotError, type DeleteBotResponse, type DeployBotData, type DeployBotError, type DeployBotResponse, type GetBotRunStatusData, type GetBotRunStatusError, type GetBotRunStatusResponse, type ListBotRunsData, type ListBotRunsError, type ListBotRunsResponse, type ListBotsError, type ListBotsResponse, type ShowBotData, type ShowBotError, type ShowBotResponse, type TriggerBotRunData, type TriggerBotRunError, type TriggerBotRunResponse, type UserCredentials, authenticateUser, deleteBot, deployBot, getBotRunStatus, getUserInfo, getUserToken, listBotRuns, listBots, logoutUser, setAuthToken, showBot, triggerBotRun };
