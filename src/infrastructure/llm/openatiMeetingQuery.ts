import OpenAI from "openai";
import type { LLMMeetingQuery } from "@/domain/interfaces/llmmeetingQueryInterface";
import { buildQueryPrompt } from "@/infrastructure/llm/prompts/meetingQueryPrompt";

export class OpenAIMeetingQuery implements LLMMeetingQuery {
	private openai: OpenAI;
	constructor(apiKey: string) {
		this.openai = new OpenAI({ apiKey });
	}

	async generateResponse(query: string, context: string): Promise<{ response: string; prompt: string }> {
		const prompt = buildQueryPrompt(query, context);

		const llmResponse = await this.openai.chat.completions.create({
			model: "gpt-4.1-nano",
			messages: [
				{
					role: "user",
					content: prompt,
				},
			],
		});

		const response = llmResponse.choices[0]?.message?.content || "{}";
		return { response, prompt };
	}
}
