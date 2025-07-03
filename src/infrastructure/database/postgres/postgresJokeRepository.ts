import type { Pool } from "pg";
import { Joke } from "@/domain/entities/jokeEntity";
import { JokeSchema } from "@/domain/models/jokeModel";
import type { JokeRepository } from "@/domain/repositories/jokeRepositoryInterface";

export class PostgresJokeRepository implements JokeRepository {
	constructor(private readonly pool: Pool) {}

	async getAll(): Promise<Joke[]> {
		const client = await this.pool.connect();
		try {
			const result = await client.query("SELECT * FROM jokes");
			return result.rows.map((row) =>
				JokeSchema.parse({
					id: row.id.toString(),
					value: row.value,
					source: null,
				}),
			);
		} finally {
			client.release();
		}
	}

	async save(joke: Joke): Promise<Joke> {
		const client = await this.pool.connect();
		try {
			const result = await client.query<{ id: number; value: string }>(
				`INSERT INTO jokes(value) 
         VALUES($1) 
         RETURNING id, value`,
				[joke.value],
			);
			if (result.rowCount === 0) {
				throw new Error("Failed to create joke");
			}
			return Joke.recreate(result.rows[0].id, result.rows[0].value);
		} finally {
			client.release();
		}
	}

	async update(id: number, updates: Partial<Omit<Joke, "id">>): Promise<Joke> {
		const client = await this.pool.connect();
		try {
			const query = `
        UPDATE jokes
        SET value = $2
        WHERE id = $1
        RETURNING *
      `;

			const result = await client.query(query, [id, updates.value]);

			if (!result.rowCount || result.rowCount === 0) {
				throw new Error("No jokes to update");
			}

			return JokeSchema.parse({
				id: result.rows[0].id.toString(),
				value: result.rows[0].value,
				source: result.rows[0].source,
			});
		} finally {
			client.release();
		}
	}

	async delete(id: number): Promise<boolean> {
		const client = await this.pool.connect();
		try {
			const result = await client.query("DELETE FROM jokes WHERE id = $1", [id]);
			return (result.rowCount ?? 0) > 0;
		} finally {
			client.release();
		}
	}
}
