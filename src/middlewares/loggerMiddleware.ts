import { Request, Response, NextFunction } from "express";
import logger from "../logger";

export const loggerMiddleware = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const startTime = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - startTime;

    const logObj = {
      requestId: req.requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration} ms`,
      ip: req.ip,
    };

    if (res.statusCode >= 500) {
      logger.error(logObj);
    } else if (res.statusCode >= 400) {
      logger.warn(logObj);
    } else {
      logger.info(logObj);
    }
  });

  next();
};
