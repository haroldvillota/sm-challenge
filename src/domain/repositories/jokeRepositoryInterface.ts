import type { Joke } from "@/domain/entities/jokeEntity";

export interface JokeRepository {
	getAll(): Promise<Joke[]>;
	save(joke: Joke): Promise<Joke>;
	update(id: number, joke: Partial<Omit<Joke, "id">>): Promise<Joke>;
	delete(id: number): Promise<boolean>;
}
