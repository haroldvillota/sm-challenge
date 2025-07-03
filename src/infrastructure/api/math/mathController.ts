import type { Request, RequestHandler, Response } from "express";
import type { MathService } from "@/application/services/mathService";
import { McmSchema } from "@/domain/schemas/mathSchema";

export class MathController {
	constructor(private readonly mathService: MathService) {}

	public calculateMcm: RequestHandler = async (req: Request, res: Response) => {
		const numbers = req.query.numbers ? (req.query.numbers as string).split(",").map(Number) : [];

		const serviceResponse = await this.mathService.calculateMcm(numbers);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public incrementNumber: RequestHandler = async (req: Request, res: Response) => {
		const number = req.query.number ? Number(req.query.number) : Number.NaN;

		const serviceResponse = await this.mathService.incrementNumber(number);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};
}
