import express from "express";
import config from "./config";
import logger from "./logger";
import { loggerMiddleware } from "./middlewares/loggerMiddleware";
import { requestIdMiddleware } from "./middlewares/requestIdMiddleware";
import metricsMiddleware from "./middlewares/metricsMiddleware";
import swaggerUi from "swagger-ui-express";
import { openapiSpecs } from "./swagger";
import routes from "./routes/miscellaneous";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(requestIdMiddleware);
app.use(loggerMiddleware);
app.use(metricsMiddleware);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpecs));
app.use("/", routes);

app.listen(config.PORT, () => {
  logger.info(
    `Server running on port ${config.PORT} in ${config.ENVIRONMENT} mode`
  );
});

export default app;
