export interface LLMMeetingQuery {
	generateResponse(query: string, context: string): Promise<{ response: string; prompt: string }>;
}
