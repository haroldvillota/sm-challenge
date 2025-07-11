import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";

import { healthCheckRegistry } from "@/infrastructure/api/healthCheck/healthCheckRouter";
import { jokeRegistry } from "@/infrastructure/api/joke/jokeRouter";
import { mathRegistry } from "@/infrastructure/api/math/mathRouter";

export type OpenAPIDocument = ReturnType<OpenApiGeneratorV3["generateDocument"]>;

export function generateOpenAPIDocument(): OpenAPIDocument {
	const registry = new OpenAPIRegistry([healthCheckRegistry, jokeRegistry, mathRegistry]);
	const generator = new OpenApiGeneratorV3(registry.definitions);

	return generator.generateDocument({
		openapi: "3.0.0",
		info: {
			version: "1.0.0",
			title: "Swagger API",
		},
		externalDocs: {
			description: "View the raw OpenAPI Specification in JSON format",
			url: "/swagger.json",
		},
	});
}
