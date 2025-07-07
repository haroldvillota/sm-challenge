import OpenAI from "openai";
import type { MeetingRecord } from "@/domain/models/meetingRecordModel";
import type { MeetingParser } from "@/domain/interfaces/meetingParserInterface";
import { buildMeetingParsePrompt } from "@/infrastructure/llm/prompts/meetingParsePrompt";

export class OpenAIMeetingParser implements MeetingParser {
	private openai: OpenAI;
	constructor(apiKey: string) {
		this.openai = new OpenAI({ apiKey });
	}

	async parse(text: string): Promise<{ record: MeetingRecord; prompt: string }> {
		const prompt = buildMeetingParsePrompt(text);
		const record = await this.createStructuredOutput(prompt);
		return { record, prompt };
	}

	private async createStructuredOutput(prompt: string): Promise<MeetingRecord> {
		const response = await this.openai.chat.completions.create({
			model: "gpt-4.1-mini",
			messages: [
				{
					role: "user",
					content: prompt,
				},
			],
			response_format: { type: "json_object" },
		});

		const parsed = JSON.parse(response.choices[0]?.message?.content || "{}") as MeetingRecord;
		return parsed;
	}
}
