import type { EmbeddingGenerator } from "@/domain/interfaces/embeddingInterface";
import type { TextSplitter } from "@/domain/interfaces/textSplitterInterface";
import type { MeetingParser } from "@/domain/interfaces/meetingParserInterface";
import type { MeetingRecord, Chunk } from "@/domain/models/meetingRecordModel";
import type { LoggerInterface } from "@/common/interfaces/loggerInterface";

export class TransformService {
	constructor(
		private readonly parser: MeetingParser,
		private readonly embedder: EmbeddingGenerator,
		private readonly textSplitter: TextSplitter,
		private readonly logger: LoggerInterface,
	) {}

	async process(text: string): Promise<Array<Chunk & { embedding: number[] }>> {
		const meetingRecord = await this.parseMeetingRecord(text);

		const chunks = await this.createChunks(meetingRecord);

		const embeddings = this.embedChunks(chunks);

		return embeddings;
	}

	async parseMeetingRecord(text: string): Promise<MeetingRecord> {
		const { record, prompt } = await this.parser.parse(text);
		this.logger.debug(prompt);
		return record;
	}

	async createChunks(meetingRecord: MeetingRecord): Promise<Chunk[]> {
		const chunks: Chunk[] = [];

		// 1. Procesar introducción
		const introParts = await this.textSplitter.splitIntroduction(meetingRecord.introduction);
		const introChunks = await Promise.all(
			introParts.map(async (content, index) => ({
				id: `${meetingRecord.id}-intro-${index}`,
				meetingRecordId: meetingRecord.id,
				chunkType: "introduction",
				content,
				metadata: {
					keywords: await this.textSplitter.extractKeywords(content),
				},
			})),
		);
		chunks.push(...introChunks);

		// 2. Procesar cláusulas
		const clauseChunks = await Promise.all(
			meetingRecord.clauses.map(async (clause, index) => {
				const clauseParts = await this.textSplitter.splitClause(clause);
				return Promise.all(
					clauseParts.map(async (content, partIndex) => ({
						id: `${meetingRecord.id}-clause-${index}-${partIndex}`,
						meetingRecordId: meetingRecord.id,
						chunkType: "clause",
						clauseId: `clause-${index}`,
						content,
						metadata: {
							keywords: await this.textSplitter.extractKeywords(content),
						},
					})),
				);
			}),
		);

		// Aplanar el array de arrays (clauseChunks es Chunk[][])
		chunks.push(...clauseChunks.flat());
		return chunks;
	}

	async embedChunks(chunks: Chunk[]): Promise<Array<Chunk & { embedding: number[] }>> {
		return Promise.all(
			chunks.map(async (chunk) => ({
				...chunk,
				embedding: await this.embedder.generateEmbedding(chunk.content),
			})),
		);
	}
}
