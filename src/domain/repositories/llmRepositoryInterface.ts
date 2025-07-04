export interface LLMService {
	combineJokes(chuckJoke: string, dadJoke: string): Promise<string>;
}
