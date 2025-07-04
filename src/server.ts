import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { pino } from "pino";

import { openAPIRouter } from "@/api-docs/openAPIRouter";
import { healthCheckRouter } from "@/infrastructure/api/healthCheck/healthCheckRouter";
import { jokeRouter } from "@/infrastructure/api/joke/jokeRouter";
import { jokesRouter } from "@/infrastructure/api/joke/jokesRouter";
import errorHandler from "@/common/middleware/errorHandler";
import rateLimiter from "@/common/middleware/rateLimiter";
import requestLogger from "@/common/middleware/requestLogger";
import { env } from "@/common/utils/envConfig";
import { ChuckFetchRepository } from "@/infrastructure/database/http/chuckFetchRepository";
import { DadFetchRepository } from "@/infrastructure/database/http/dadFetchRepository";
import { PostgresJokeRepository } from "@/infrastructure/database/postgres/postgresJokeRepository";
import { OpenAIService } from "@/infrastructure/llm/openai";
import { JokeController } from "@/infrastructure/api/joke/jokeController";
import { pool } from "@/infrastructure/database/postgres";
import { JokeService } from "@/application/services/jokeService";

import { mathRouter } from "@/infrastructure/api/math/mathRouter";
import { MathService } from "@/application/services/mathService";
import { MathController } from "@/infrastructure/api/math/mathController";

const logger = pino({ name: "server start" });

const app: Express = express();

app.set("trust proxy", true);

const postgresRepository = new PostgresJokeRepository(pool);
const chuckFetchRepository = new ChuckFetchRepository();
const dadFetchRepository = new DadFetchRepository();
const openAIService = new OpenAIService(env.OPENAI_API_KEY);

const jokeService = new JokeService(postgresRepository, chuckFetchRepository, dadFetchRepository, openAIService);
const jokeController = new JokeController(jokeService);

const mathService = new MathService();
const mathController = new MathController(mathService);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(rateLimiter);

// Request logging
app.use(requestLogger);

// Routes
app.use("/health-check", healthCheckRouter);
app.use("/joke", jokeRouter(jokeController));
app.use("/jokes", jokesRouter(jokeController));
app.use("/math", mathRouter(mathController));

// Swagger UI
app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };
