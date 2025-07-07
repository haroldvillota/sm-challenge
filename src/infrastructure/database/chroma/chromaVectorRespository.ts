import { ChromaClient } from "chromadb";
import type { VectorRepository } from "@/domain/repositories/vectorRepositoryInterface";
import type { Chunk } from "@/domain/models/meetingRecordModel";

import { env } from "@/common/utils/envConfig";

export class ChromaVectorRepository implements VectorRepository {
	private readonly client: ChromaClient;
	private readonly collectionName: string;

	constructor() {
		// Connect chroma in default database
		this.client = new ChromaClient({
			ssl: false,
			host: env.CHROMA_DB_HOST,
			port: env.CHROMA_DB_PORT,
			headers: {},
		});
		this.collectionName = "meeting_record_chunks";
	}

	async upsertChunks(chunks: (Chunk & { embedding: number[] })[]): Promise<void> {
		const collection = await this.client.getOrCreateCollection({
			name: this.collectionName,
			metadata: { "hnsw:space": "cosine" }, // Similaridad coseno
		});

		await collection.upsert({
			ids: chunks.map((c) => c.id),
			embeddings: chunks.map((c) => c.embedding),
			metadatas: chunks.map((c) => ({
				meetingId: c.meetingRecordId,
				chunkType: c.chunkType,
				clauseId: c.clauseId || null,
				keywords: c.metadata.keywords.join(","),
			})),
			documents: chunks.map((c) => c.content),
		});
	}

	async clearCollection(): Promise<void> {
		await this.client.deleteCollection({ name: this.collectionName });
	}

	async findSimilarChunks(embedding: number[], topK = 3): Promise<Chunk[]> {
		const collection = await this.client.getCollection({
			name: this.collectionName,
			embeddingFunction: undefined,
		});
		const results = await collection.query({
			queryEmbeddings: [embedding],
			nResults: topK,
		});

		// Validación de resultados
		if (!results.ids[0] || !results.metadatas[0] || !results.documents[0]) {
			return [];
		}

		return results.ids[0].map((id, index) => {
			// Manejo seguro de metadatos
			const metadata = results.metadatas[0][index] || {};
			const document = results.documents[0][index] || "";

			return {
				id: String(id),
				meetingRecordId: String(metadata.meetingId || ""),
				chunkType: String(metadata.chunkType || ""),
				clauseId: metadata.clauseId ? String(metadata.clauseId) : undefined,
				content: String(document),
				metadata: {
					keywords: metadata.keywords ? String(metadata.keywords).split(",") : [],
				},
			};
		});
	}
}
