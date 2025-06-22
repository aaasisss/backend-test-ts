import os from "os";
import express from "express";
import config from "./config";
import logger from "./logger";
import { loggerMiddleware } from "./middlewares/loggerMiddleware";
import { requestIdMiddleware } from "./middlewares/requestIdMiddleware";
import promClient from "prom-client";
import metricsMiddleware from "./middlewares/metricsMiddleware";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(requestIdMiddleware);
app.use(loggerMiddleware);
app.use(metricsMiddleware);

app.listen(config.PORT, () => {
  logger.info(
    `Server running on port ${config.PORT} in ${config.ENVIRONMENT} mode`
  );
});

app.get("/healthcheck", (_, res) => {
  res.status(200).send("alive");
});

app.get("/", (_, res) => {
  res.status(200).send("Hello World!");
});

app.get("/host", (_, res) => {
  res.send(os.hostname());
});

app.get("/error", (_, res) => {
  res.status(400).send({ message: "error" });
});

app.get("/server-error", (_, res) => {
  res.status(500).send({ message: "Internal Server Error" });
});

app.get("/cpu", (req, res) => {
  for (let i = 0; i < 1000000000; i++) {
    Math.random();
  }
  res.send("Hello World");
});

app.get("/metrics", async (req, res) => {
  const metrics = await promClient.register.metrics();
  res.set("Content-Type", promClient.register.contentType);
  res.send(metrics);
});

export default app;
