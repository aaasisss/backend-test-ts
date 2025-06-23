import { NextFunction, Request, Response } from "express";
import client from "prom-client";

const requestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
});

const activeRequestsGauge = new client.Gauge({
  name: "active_requests",
  help: "Number of active requests",
  labelNames: ["route", "method"],
});

const requestDurationHistogram = new client.Histogram({
  name: "request_duration",
  help: "Request duration in milliseconds",
  labelNames: ["route", "method", "status_code"],
  buckets: [0.1, 5, 15, 50, 100, 200, 300, 500, 1000, 2000, 3000, 5000],
});

const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const route = req.route?.path || req.path;
  const startDate = Date.now();

  activeRequestsGauge.inc({ route, method: req.method });

  res.on("finish", () => {
    const duration = Date.now() - startDate;

    requestCounter.inc({
      route,
      method: req.method,
      status_code: res.statusCode,
    });

    requestDurationHistogram.observe(
      {
        route,
        method: req.method,
        status_code: res.statusCode,
      },
      duration
    );

    activeRequestsGauge.dec({
      route,
      method: req.method,
    });
  });

  next();
};

export default metricsMiddleware;
