import axios from "axios";
import type { Joke } from "@/domain/entities/jokeEntity";

export class DadFetchRepository {
	private readonly apiUrl = "https://icanhazdadjoke.com/";
	private readonly headers = {
		Accept: "application/json",
	};

	async fetchRandom(): Promise<Joke> {
		try {
			const response = await axios.get(this.apiUrl, { headers: this.headers });
			return {
				id: response.data.id,
				value: response.data.joke,
				source: "dad",
			};
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(`Failed to fetch joke: ${error.message}`);
			}
			throw new Error("Failed to fetch joke: Unknown error");
		}
	}
}
