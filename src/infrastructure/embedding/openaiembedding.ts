import type { EmbeddingGenerator } from "@/domain/repositories/embeddingInterface";
import { OpenAI } from "openai";

export class OpenAIEmbeddings implements EmbeddingGenerator {
	private openai: OpenAI;

	constructor(apiKey: string) {
		this.openai = new OpenAI({ apiKey });
	}

	async generateEmbedding(text: string): Promise<number[]> {
		const response = await this.openai.embeddings.create({
			model: "text-embedding-3-small",
			input: text,
			//encoding_format: "float",
		});
		return response.data[0].embedding;
	}
}
