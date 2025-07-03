import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { JokeSchema } from "@/domain/models/jokeModel";

import type { JokeController } from "@/infrastructure/api/joke/jokeController";

export const jokeRegistry = new OpenAPIRegistry();

jokeRegistry.registerPath({
	method: "get",
	path: "/jokes",
	tags: ["Joke"],
	responses: createApiResponse(z.array(JokeSchema), "Success"),
});

export function jokesRouter(controller: JokeController) {
	const router: Router = express.Router();

	router.get("/", controller.getJokes);

	return router;
}
