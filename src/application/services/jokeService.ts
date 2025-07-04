import { StatusCodes } from "http-status-codes";
import { Joke } from "@/domain/entities/jokeEntity";
import type { JokeFetchRepository } from "@/domain/repositories/jokeFetchRepositoryInterface";
import type { JokeRepository } from "@/domain/repositories/jokeRepositoryInterface";
import type { LLMService } from "@/domain/repositories/llmRepositoryInterface";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
type JokeSource = "chuck" | "dad";

export class JokeService {
	constructor(
		private jokeRepository: JokeRepository,
		private chuckRepository: JokeFetchRepository,
		private dadRepository: JokeFetchRepository,
		private llmService: LLMService,
	) {}

	// Retrieves a single random joke
	async findOneRandom(source?: "chuck" | "dad"): Promise<ServiceResponse<Joke | null>> {
		try {
			const selectedRepository = this.selectRepository(source);

			const joke = await selectedRepository.fetchRandom();

			return ServiceResponse.success<Joke>("Joke found", joke);
		} catch (ex) {
			const errorMessage = `Error finding joke from source ${source}:, ${(ex as Error).message}`;
			logger.error(errorMessage);
			return ServiceResponse.failure("An error occurred while finding joke.", null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	private selectRepository(source?: "chuck" | "dad"): JokeFetchRepository {
		if (source) {
			if (source.toLowerCase() === "chuck") return this.chuckRepository;
			if (source === "dad") return this.dadRepository;
		}

		const sources = ["chuck", "dad"] as const;
		const randomSource = sources[Math.floor(Math.random() * sources.length)];
		return randomSource === "chuck" ? this.chuckRepository : this.dadRepository;
	}

	async listJokes(): Promise<ServiceResponse<Joke[] | null>> {
		try {
			const jokes = await this.jokeRepository.getAll();

			return ServiceResponse.success<Joke[]>("Jokes", jokes);
		} catch (ex) {
			const errorMessage = `Error finding jokes , ${(ex as Error).message}`;
			logger.error(errorMessage);
			return ServiceResponse.failure("An error occurred while finding jokes.", null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	async createJoke(value: string): Promise<ServiceResponse<Joke | null>> {
		try {
			const newJoke = Joke.create(value);
			const savedJoke = await this.jokeRepository.save(newJoke);

			return ServiceResponse.success<Joke>("Created Joke", savedJoke);
		} catch (ex) {
			const errorMessage = `Error saving joke , ${(ex as Error).message}`;
			logger.error(errorMessage);
			return ServiceResponse.failure("An error occurred while saving joke.", null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	async updateJoke(id: number, newValue: string): Promise<ServiceResponse<Joke | null>> {
		try {
			const joke = Joke.recreate(id, newValue);

			const updatedJoke = await this.jokeRepository.update(id, joke);

			return ServiceResponse.success<Joke>("Updated Joke", updatedJoke);
		} catch (ex) {
			const errorMessage = `Error updating joke , ${(ex as Error).message}`;
			logger.error(errorMessage);
			return ServiceResponse.failure("An error occurred while updating joke.", null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	async deleteJoke(id: number): Promise<ServiceResponse<boolean>> {
		try {
			const wasDeleted = await this.jokeRepository.delete(id);
			if (!wasDeleted) {
				throw new Error("Failed deliting joke");
			}

			return ServiceResponse.success<boolean>("Deleted Joke", true);
		} catch (ex) {
			const errorMessage = `Error deleting joke , ${(ex as Error).message}`;
			logger.error(errorMessage);
			return ServiceResponse.failure(
				"An error occurred while deleting joke.",
				false,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async getCombinedJokes(): Promise<ServiceResponse<Array<{ chuck: string; dad: string; combined: string }>>> {
		try {
			const qty = 5;

			const [chuckPromises, dadPromises] = [
				Array(qty)
					.fill(null)
					.map(() => this.chuckRepository.fetchRandom()),
				Array(qty)
					.fill(null)
					.map(() => this.dadRepository.fetchRandom()),
			];

			// Wait for all request
			const [chuckResults, dadResults] = await Promise.all([Promise.all(chuckPromises), Promise.all(dadPromises)]);

			// Validation
			if (chuckResults.length !== qty || dadResults.length !== qty) {
				throw new Error("Could not get all the jokes needed");
			}

			const combinedPromises = chuckResults.map((chuckJoke, index) => {
				const dadJoke = dadResults[index];
				return this.combineJokePair(chuckJoke.value, dadJoke.value);
			});

			const combinedResults = await Promise.all(combinedPromises);

			return ServiceResponse.success("Combined jokes retrieved successfully", combinedResults);
		} catch (ex) {
			const errorMessage = `Error combining jokes: ${(ex as Error).message}`;
			logger.error(errorMessage);
			return ServiceResponse.failure("An error occurred while combining jokes", [], StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	private async combineJokePair(
		chuckJoke: string,
		dadJoke: string,
	): Promise<{ chuck: string; dad: string; combined: string }> {
		try {
			// Aquí implementarías la llamada al LLM
			const combined = await this.llmService.combineJokes(chuckJoke, dadJoke);

			return {
				chuck: chuckJoke,
				dad: dadJoke,
				combined: combined || this.defaultCombine(chuckJoke, dadJoke),
			};
		} catch (error) {
			logger.error(`Error combining jokes with LLM: ${error}`);
			return {
				chuck: chuckJoke,
				dad: dadJoke,
				combined: this.defaultCombine(chuckJoke, dadJoke),
			};
		}
	}

	private defaultCombine(chuckJoke: string, dadJoke: string): string {
		// Fallback si el LLM falla
		return `${chuckJoke} Also, ${dadJoke.toLowerCase()}`;
	}
}
