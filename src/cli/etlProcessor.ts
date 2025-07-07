#!/usr/bin/env node

import path from "node:path";
import fs from "node:fs";
import { pino } from "pino";
import type { MeetingRecord, Chunk } from "@/domain/models/meetingRecordModel";

import { ExtractService } from "@/application/services/meetingRecords/extractService";
import { TransformService } from "@/application/services/meetingRecords/transformService";
import { LoadService } from "@/application/services/meetingRecords/loadService";

import { OpenAIEmbeddings } from "@/infrastructure/embedding/openaiembedding";
import { OpenAIMeetingParser } from "@/infrastructure/meetingParser/openAiMeetingParser";
import { SemanticTextSplitter } from "@/infrastructure/textSplitter/semanticTextSplitter";
import { ChromaVectorRepository } from "@/infrastructure/database/chroma/chromaVectorRespository";
import { env } from "@/common/utils/envConfig";

function getLogFileName() {
	const now = new Date();
	const date = now.toISOString().split("T")[0]; // YYYY-MM-DD
	const time = now.toTimeString().split(" ")[0].replace(/:/g, "-"); // HH-MM-SS
	return `logs_${date}_${time}.json`;
}

const logsDir = path.resolve(__dirname, "../../logs");
if (!fs.existsSync(logsDir)) {
	fs.mkdirSync(logsDir);
}

const logFilePath = path.join(logsDir, getLogFileName());
const logStream = fs.createWriteStream(logFilePath, { flags: "a" });

const logger = pino({ name: "etl begin", level: "debug" }, logStream);

async function main() {
	const [, , pdfFilename] = process.argv;

	if (!pdfFilename) {
		console.error("Usage: npm run process-pdf <path-to-pdf>");
		process.exit(1);
	}

	try {
		const fileId = pdfFilename.split(".")[0];
		const dataDir = path.resolve(process.cwd(), "data", "raw");

		const embeddingGenerator = new OpenAIEmbeddings(env.OPENAI_API_KEY);
		const openAIMeetingParser = new OpenAIMeetingParser(env.OPENAI_API_KEY);
		const textSplitter = new SemanticTextSplitter();
		const chromaVectorRespository = new ChromaVectorRepository();

		const extractService = new ExtractService(logger);
		const transformService = new TransformService(openAIMeetingParser, embeddingGenerator, textSplitter, logger);
		const loadService = new LoadService(chromaVectorRespository, logger);

		// text
		let text: string;
		const absolutePathTxt = path.resolve(dataDir, `${fileId}.txt`);
		if (fs.existsSync(absolutePathTxt)) {
			text = fs.readFileSync(absolutePathTxt, "utf-8");
		} else {
			const absolutePathPdf = path.resolve(dataDir, pdfFilename);
			const processPdfResult = await extractService.processPdf(absolutePathPdf);
			text = processPdfResult.text;
			fs.writeFileSync(absolutePathTxt, text);
		}

		// meetingRecord
		let record: MeetingRecord;
		const absolutePathRecord = path.resolve(dataDir, `${fileId}-record.json`);
		if (fs.existsSync(absolutePathRecord)) {
			const jsonContent = fs.readFileSync(absolutePathRecord, "utf-8");
			record = JSON.parse(jsonContent) as MeetingRecord;
		} else {
			record = await transformService.parseMeetingRecord(text);
			record.id = fileId;
			fs.writeFileSync(absolutePathRecord, JSON.stringify(record, null, 2), "utf-8");
		}

		// chunks
		let chunks: Chunk[];
		const absolutePathChunks = path.resolve(dataDir, `${fileId}-chunks.json`);
		if (fs.existsSync(absolutePathChunks)) {
			const jsonContent = fs.readFileSync(absolutePathChunks, "utf-8");
			chunks = JSON.parse(jsonContent) as Chunk[];
		} else {
			chunks = await transformService.createChunks(record);
			fs.writeFileSync(absolutePathChunks, JSON.stringify(chunks, null, 2), "utf-8");
		}

		// chunks

		let embeddings: Array<Chunk & { embedding: number[] }>;
		const absolutePathEmbeddings = path.resolve(dataDir, `${fileId}-embeddings.json`);
		if (fs.existsSync(absolutePathEmbeddings)) {
			const jsonContent = fs.readFileSync(absolutePathEmbeddings, "utf-8");
			embeddings = JSON.parse(jsonContent) as Array<Chunk & { embedding: number[] }>;
		} else {
			embeddings = await transformService.embedChunks(chunks);
			fs.writeFileSync(absolutePathEmbeddings, JSON.stringify(embeddings, null, 2), "utf-8");
		}

		await chromaVectorRespository.upsertChunks(embeddings);

		logger.info("Success!");
	} catch (e) {
		const errorMessage = `Error in etl pipeline: ${(e as Error).message}`;
		logger.error("Error:", e);
		console.error("Error:", errorMessage);
		process.exit(1);
	}
}

main();
