import { z } from "zod";

export const McmSchema = z.object({
	query: z.object({
		numbers: z.string().regex(/^\d+(,\d+)*$/, {
			message: "Numbers must be a comma-separated list of integers",
		}),
	}),
});

export const IncrementSchema = z.object({
	query: z.object({
		number: z.string().regex(/^\d+$/, {
			message: "Number must be a positive integer",
		}),
	}),
});

export type McmQuery = z.infer<typeof McmSchema>;
export type IncrementQuery = z.infer<typeof IncrementSchema>;
