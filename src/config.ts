import dotenv from "dotenv";

dotenv.config();

interface Config {
  PORT: number;
  ENVIRONMENT: "dev" | "prod";
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX_REQUESTS: number;
}

const config: Config = {
  PORT: Number(process.env.PORT) || 3000,
  ENVIRONMENT: (process.env.NODE_ENV || "dev") as Config["ENVIRONMENT"],
  RATE_LIMIT_MAX_REQUESTS: Number(process.env.RATE_LIMIT_MAX_REQUESTS ?? 100),
  RATE_LIMIT_WINDOW_MS: Number(
    process.env.RATE_LIMIT_WINDOW_MS ?? 15 * 60 * 1000 // 15 minutes
  ),
};

export default config;
