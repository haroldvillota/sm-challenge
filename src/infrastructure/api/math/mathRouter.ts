import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { McmSchema, IncrementSchema } from "@/domain/schemas/mathSchema";
import { validateRequest } from "@/common/utils/httpHandlers";
import type { MathController } from "@/infrastructure/api/math/mathController";

export const mathRegistry = new OpenAPIRegistry();

mathRegistry.registerPath({
	method: "get",
	path: "/mcm",
	tags: ["Math"],
	request: {
		query: McmSchema.shape.query,
	},
	responses: createApiResponse(z.number(), "Success"),
});

mathRegistry.registerPath({
	method: "get",
	path: "/increment",
	tags: ["Math"],
	request: {
		query: IncrementSchema.shape.query,
	},
	responses: createApiResponse(z.number(), "Success"),
});

export function mathRouter(controller: MathController) {
	const router: Router = express.Router();

	router.get("/mcm", validateRequest(McmSchema), controller.calculateMcm);

	router.get("/increment", validateRequest(IncrementSchema), controller.incrementNumber);

	return router;
}
