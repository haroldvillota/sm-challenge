import type { Request, RequestHandler, Response } from "express";
import type { JokeService } from "@/application/services/jokeService";
export type JokeSource = "chuck" | "dad";

export class JokeController {
	constructor(private readonly jokeService: JokeService) {}

	public getJokes: RequestHandler = async (_req: Request, res: Response) => {
		const serviceResponse = await this.jokeService.listJokes();
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public getJoke: RequestHandler = async (req: Request, res: Response) => {
		const source = req.params.source ? (req.params.source.toLowerCase() as JokeSource) : undefined;

		const serviceResponse = await this.jokeService.findOneRandom(source);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public saveJoke: RequestHandler = async (req: Request, res: Response) => {
		const value = req.query.value as string;

		const serviceResponse = await this.jokeService.createJoke(value);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public updateJoke: RequestHandler = async (req: Request, res: Response) => {
		const id = Number(req.query.number);

		/* TODO
		if (isNaN(id)) {
			return res.status(400).json({ error: "ID must be a valid number" });
		}
		*/

		const value = req.query.value as string;

		const serviceResponse = await this.jokeService.updateJoke(id, value);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public deleteJoke: RequestHandler = async (req: Request, res: Response) => {
		const id = Number(req.query.number);

		const serviceResponse = await this.jokeService.deleteJoke(id);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public getCombinedJokes: RequestHandler = async (_req: Request, res: Response) => {
		const serviceResponse = await this.jokeService.getCombinedJokes();
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};
}
