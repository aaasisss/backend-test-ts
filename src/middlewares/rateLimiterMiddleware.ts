import config from "../config";
import { rateLimit } from "express-rate-limit";
import logger from "../logger";
import { RedisStore } from "rate-limit-redis";
import { createClient } from "redis";

const redisClient = createClient({
  url: "redis://localhost:6379/",
});

let isErrorConnectingToRedis = false;

redisClient.on("connect", () => {
  logger.info("Connected to Redis");
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
  isErrorConnectingToRedis = true;
});

redisClient.connect().catch((err) => {
  console.error("Failed to connect to Redis:", err);
  isErrorConnectingToRedis = true;
});

export const rateLimiterMiddleware = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  limit: config.RATE_LIMIT_MAX_REQUESTS || 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 56,
  store:
    config.ENVIRONMENT !== "prod"
      ? new RedisStore({
          sendCommand: (...args: string[]) => redisClient.sendCommand(args),
        })
      : undefined,
  skipFailedRequests: true,
});

export default rateLimiterMiddleware;
