import type { Joke } from "@/domain/entities/jokeEntity";
import axios from "axios";

export class ChuckFetchRepository {
	private readonly apiUrl = "https://api.chucknorris.io/jokes/random";

	async fetchRandom(): Promise<Joke> {
		try {
			const response = await axios.get(this.apiUrl);
			return {
				id: response.data.id,
				value: response.data.value,
				source: "chuck",
			};
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(`Failed to fetch joke: ${error.message}`);
			}
			throw new Error("Failed to fetch joke: Unknown error");
		}
	}
}
