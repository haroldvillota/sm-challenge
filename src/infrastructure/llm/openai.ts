import OpenAI from "openai";
import type { LLMService } from "@/domain/repositories/llmRepositoryInterface";

export class OpenAIService implements LLMService {
	private openai: OpenAI;

	constructor(apiKey: string) {
		this.openai = new OpenAI({ apiKey });
	}

	async combineJokes(chuckJoke: string, dadJoke: string): Promise<string> {
		const prompt = `Combine two jokes into one coherent and funny hybrid. Follow these rules:

- Preserve the original language of both jokes (no translation).
- Method: Use concatenation, remixing, or free-style fusion—but ensure logical flow.
- Prioritize humor and coherence over forced connections.
- Respond ONLY with the final combined joke

Example:

1: Chuck Norris counted to infinity. Twice.
2: Why did the math book look sad? Because it had too many problems.

Response: Chuck Norris counted to infinity. Also, the math book had too many problems.
------------

Jokes to combine:

1: ${chuckJoke}
2: ${dadJoke}
`;

		const response = await this.openai.chat.completions.create({
			model: "gpt-3.5-turbo",
			messages: [{ role: "user", content: prompt }],
			temperature: 0.7,
			max_tokens: 100,
		});

		return response.choices[0]?.message?.content?.trim() || "";
	}
}
