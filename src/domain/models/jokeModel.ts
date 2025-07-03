import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

//export type Joke = z.infer<typeof JokeSchema>;
export const JokeSchema = z.object({
	id: commonValidations.id,
	value: z.string(),
	source: z.string().nullable(),
});

// Input Validation for 'GET joke/:source' endpoint
export const GetJokeSchema = z.object({
	params: z.object({
		source: z.string().refine((value) => ["chuck", "dad"].includes(value.toLowerCase()), {
			message: "Source must be either 'Chuck' or 'Dad'",
		}),
	}),
});

export const PostJokeSchema = z.object({
	query: z.object({
		value: z
			.string()
			.min(3, "Text must be at least 3 characters")
			.max(512, "Text cannot exceed 512 characters")
			.refine((val) => val.trim().length > 0, {
				message: "Text cannot be empty",
			})
			.transform((val) => val.trim()),
	}),
});

export const UpdateJokeSchema = z.object({
	query: z.object({
		value: z
			.string()
			.min(3, "Text must be at least 3 characters")
			.max(200, "Text cannot exceed 200 characters")
			.refine((val) => val.trim().length > 0, {
				message: "Text cannot be empty",
			})
			.transform((val) => val.trim()),
		number: commonValidations.id,
	}),
});

export const DeleteJokeSchema = z.object({
	query: z.object({
		number: commonValidations.id,
	}),
});
