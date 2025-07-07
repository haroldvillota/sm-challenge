export interface TextSplitter {
	splitIntroduction(text: string): Promise<string[]>;
	splitClause(clause: { number: string; title: string; content: string }): Promise<string[]>;
	extractKeywords(text: string): Promise<string[]>;
}
