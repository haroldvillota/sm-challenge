import type { VectorRepository } from "@/domain/repositories/vectorRepositoryInterface";
import type { Chunk } from "@/domain/models/meetingRecordModel";
import type { LoggerInterface } from "@/common/interfaces/loggerInterface";
import type { EmbeddingGenerator } from "@/domain/interfaces/embeddingInterface";

import type { LLMCompletation } from "@/domain/interfaces/llmCompletationInterface";

export class RAGService {
	constructor(
		private readonly vectorRepository: VectorRepository,
		private readonly embedder: EmbeddingGenerator,
		private readonly llm: LLMCompletation,
		private readonly logger: LoggerInterface,
	) {}

	async retrieveRelevantChunks(query: string, topK = 5): Promise<Chunk[]> {
		try {
			this.logger.info(`Retrieving relevant chunks for query: "${query}"`);

			// 1. Generar embedding de la consulta
			const queryEmbedding = await this.embedder.generateEmbedding(query);

			// 2. Buscar chunks similares
			const relevantChunks = await this.vectorRepository.findSimilarChunks(queryEmbedding, topK);

			this.logger.info(`Found ${relevantChunks.length} relevant chunks`);
			return relevantChunks;
		} catch (e) {
			const errorMessage = `Error retrieving chunks: ${(e as Error).message}`;
			this.logger.error(errorMessage);
			throw new Error(errorMessage);
		}
	}

	async query(query: string, topK = 5): Promise<string> {
		try {
			this.logger.info(`Processing RAG query: "${query}"`);

			// 1. Obtener chunks relevantes
			const relevantChunks = await this.retrieveRelevantChunks(query, topK);

			if (relevantChunks.length === 0) {
				this.logger.warn("No relevant chunks found for query");
				return "No relevant information found";
			}

			// 2. Construir contexto
			const context = relevantChunks
				.map((chunk) => `[Document: ${chunk.meetingRecordId}, Type: ${chunk.chunkType}]\n${chunk.content}`)
				.join("\n\n---\n\n");

			this.logger.debug("Generated context:", { context });

			// 3. Consultar al LLM
			const prompt = `
                Answer the following question based ONLY on the provided context.
                If you don't know the answer, say "I don't have information about that".
                
                Question: ${query}
                
                Context:
                ${context}
            `;

			const response = await this.llm.generateResponse(prompt);

			this.logger.info("LLM response generated successfully");
			return response;
		} catch (e) {
			const errorMessage = `Error in RAG pipeline: ${(e as Error).message}`;
			this.logger.error(errorMessage);
			throw new Error(errorMessage);
		}
	}
}
