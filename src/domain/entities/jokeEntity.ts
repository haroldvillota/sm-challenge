export class Joke {
	private constructor(
		public readonly id: number | null,
		public readonly value: string,
		public readonly source: string | null,
	) {}

	static create(value: string): Joke {
		if (value.length < 3) {
			throw new Error("Joke text must be at least 3 characters");
		}
		return new Joke(null, value, null);
	}

	static recreate(id: number, value: string): Joke {
		return new Joke(id, value, null);
	}
}
