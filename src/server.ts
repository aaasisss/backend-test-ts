import os from "os";
import express from "express";
import config from "./config";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
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

app.get("/cpu", (req, res) => {
  for (let i = 0; i < 10000000000; i++) {
    Math.random();
  }
  res.send("Hello World");
});

export default app;
