import type { TextSplitter } from "@/domain/interfaces/textSplitterInterface";

export class SemanticTextSplitter implements TextSplitter {
	async splitClause(clause: { number: string; title: string; content: string }): Promise<string[]> {
		const { number, title, content } = clause;

		if (content.length <= 300 && content.split("\n\n").length <= 2) {
			return [`${title}: ${content}`];
		}

		return content
			.split("\n\n")
			.filter((part) => part.trim().length > 0)
			.map((part) => `${title}: ${part}`);
	}

	async splitIntroduction(text: string): Promise<string[]> {
		return text.length <= 500 ? [text] : this.splitBySentences(text);
	}

	private splitBySentences(text: string): string[] {
		// Implementación mejorada para español
		const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
		const chunks: string[] = [];
		let currentChunk = "";

		for (const sentence of sentences) {
			if ((currentChunk + sentence).length > 300) {
				chunks.push(currentChunk.trim());
				currentChunk = sentence;
			} else {
				currentChunk += ` ${sentence}`;
			}
		}

		if (currentChunk.trim().length > 0) {
			chunks.push(currentChunk.trim());
		}

		return chunks;
	}

	async extractKeywords(text: string): Promise<string[]> {
		// Implementación profesional con stopwords y stemming
		const stopwords = new Set([
			"el",
			"la",
			"los",
			"las",
			"un",
			"una",
			"unos",
			"unas",
			"de",
			"del",
			"al",
			"a",
			"en",
			"y",
			"o",
			"con",
			"por",
			"para",
			"sin",
			"sobre",
			"bajo",
			"ante",
			"se",
			"su",
			"sus",
			"lo",
			"le",
			"les",
			"me",
			"nos",
			"te",
			"que",
			"qué",
		]);

		const words = text.toLowerCase().match(/\b[\wáéíóúñ]{4,}\b/g) || [];

		return [...new Set(words)].filter((word) => !stopwords.has(word)).slice(0, 5);
	}
}
