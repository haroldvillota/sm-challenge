import { readFileSync } from "node:fs";
import pdfParse from "pdf-parse";
import type { LoggerInterface } from "@/common/interfaces/loggerInterface";

export class ExtractService {
	constructor(private readonly logger: LoggerInterface) {}

	async processPdf(filePath: string): Promise<{ text: string; metadata: unknown }> {
		try {
			const pdfBuffer = readFileSync(filePath);
			const { text, metadata } = await pdfParse(pdfBuffer);
			return { text, metadata };
		} catch (e) {
			const errorMessage = `Error processing PDF: ${(e as Error).message}`;
			this.logger.error(errorMessage);
			throw new Error(errorMessage);
		}
	}
}
