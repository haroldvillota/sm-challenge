import type { Chunk } from "@/domain/models/meetingRecordModel";

export interface VectorRepository {
	upsertChunks(chunks: (Chunk & { embedding: number[] })[]): Promise<void>;
	findSimilarChunks(embedding: number[], topK?: number): Promise<Chunk[]>;
}
