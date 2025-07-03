import type { Joke } from "@/domain/entities/jokeEntity";

export function createMockJoke(overrides: Partial<Joke> = {}): Joke {
	const defaults: Joke = {
		id: 1,
		value: "Why did the chicken cross the road?",
		source: "chuck",
	};

	return { ...defaults, ...overrides };
}
