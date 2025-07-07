export interface LLMCompletation {
	generateResponse(promp: string): Promise<string>;
}
