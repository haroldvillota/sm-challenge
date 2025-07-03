import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import {
	GetJokeSchema,
	JokeSchema,
	PostJokeSchema,
	UpdateJokeSchema,
	DeleteJokeSchema,
} from "@/domain/models/jokeModel";
import { validateRequest } from "@/common/utils/httpHandlers";
import type { JokeController } from "@/infrastructure/api/joke/jokeController";

export const jokeRegistry = new OpenAPIRegistry();

jokeRegistry.register("Joke", JokeSchema);

jokeRegistry.registerPath({
	method: "get",
	path: "/joke",
	tags: ["Joke"],
	responses: createApiResponse(z.array(JokeSchema), "Success"),
});

jokeRegistry.registerPath({
	method: "get",
	path: "/joke/{source}",
	tags: ["Joke"],
	request: { params: GetJokeSchema.shape.params },
	responses: createApiResponse(JokeSchema, "Success"),
});

export function jokeRouter(controller: JokeController) {
	const router: Router = express.Router();

	router.get("/", controller.getJoke);
	router.get("/:source", validateRequest(GetJokeSchema), controller.getJoke);
	router.post("/", validateRequest(PostJokeSchema), controller.saveJoke);
	router.put("/", validateRequest(UpdateJokeSchema), controller.updateJoke);
	router.delete("/", validateRequest(DeleteJokeSchema), controller.deleteJoke);

	return router;
}
