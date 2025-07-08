import type { VectorRepository } from "@/domain/repositories/vectorRepositoryInterface";
import type { Chunk } from "@/domain/models/meetingRecordModel";
import type { LoggerInterface } from "@/common/interfaces/loggerInterface";

export class LoadService {
	constructor(
		private readonly vectorRepository: VectorRepository,
		private readonly logger: LoggerInterface,
	) {}

	async saveChunks(chunks: (Chunk & { embedding: number[] })[]): Promise<void> {
		try {
			await this.vectorRepository.upsertChunks(chunks);
		} catch (e) {
			const errorMessage = `Error in saveChunks: ${(e as Error).message}`;
			this.logger.error(errorMessage);
			throw new Error(errorMessage);
		}
	}
}
