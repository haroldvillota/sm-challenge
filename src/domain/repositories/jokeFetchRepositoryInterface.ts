import type { Joke } from "@/domain/entities/jokeEntity";

export interface JokeFetchRepository {
	fetchRandom(): Promise<Joke>;
}
