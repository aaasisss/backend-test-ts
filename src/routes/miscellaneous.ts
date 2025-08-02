import { Router } from "express";
import os from "os";
import promClient from "prom-client";
import { rateLimiterMiddleware } from "../middlewares/rateLimiterMiddleware";

const router = Router();

/**
 * @openapi
 * /healthcheck:
 *   get:
 *     description: Health check endpoint
 *     responses:
 *       200:
 *         description: Server is alive
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: alive
 */
router.get("/healthcheck", (_, res) => {
  res.status(200).send("alive");
});

/**
 * @openapi
 * /:
 *   get:
 *     description: Root endpoint
 *     responses:
 *       200:
 *         description: Returns Hello World!
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Hello World!
 */
router.get("/", (_, res) => {
  res.status(200).send("Hello World!");
});

/**
 * @openapi
 * /host:
 *   get:
 *     description: Returns hostname of the host machine
 *     responses:
 *       200:
 *         description: Returns hostname of the host machine
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */
router.get("/host", (_, res) => {
  res.send(os.hostname());
});

/**
 * @openapi
 * /error:
 *   get:
 *     description: Returns a 400 error
 *     responses:
 *       400:
 *         description: Error response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: error
 */
router.get("/error", (_, res) => {
  res.status(400).send({ message: "error" });
});

/**
 * @openapi
 * /server-error:
 *   get:
 *     description: Returns a 500 server error
 *     responses:
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.get("/server-error", (_, res) => {
  res.status(500).send({ message: "Internal Server Error" });
});

/**
 * @openapi
 * /cpu:
 *   get:
 *     description: Performs a CPU intensive calculation and returns the result
 *     responses:
 *       200:
 *         description: Calculation result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalSum:
 *                   type: number
 *                   example: 499999999500000000
 */
router.get("/cpu", (req, res) => {
  let totalSum: number = 0;
  for (let i = 0; i < 1000000000; i++) {
    totalSum += i;
  }
  res.json({ totalSum: totalSum });
});

/**
 * @openapi
 * /protected-route:
 *   get:
 *     description: Protected route with rate limiting
 *     responses:
 *       200:
 *         description: Success response
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Hello from protected-route!
 *       429:
 *         description: Too many requests
 */
router.get("/protected-route", rateLimiterMiddleware, (_, res) => {
  res.status(200).send("Hello from protected-route!");
});

/**
 * @openapi
 * /metrics:
 *   get:
 *     description: Returns Prometheus metrics
 *     responses:
 *       200:
 *         description: Prometheus metrics
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */
router.get("/metrics", async (req, res) => {
  const metrics = await promClient.register.metrics();
  res.set("Content-Type", promClient.register.contentType);
  res.send(metrics);
});

export default router;
