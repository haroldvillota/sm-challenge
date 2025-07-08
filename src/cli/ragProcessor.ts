#!/usr/bin/env node

import path from "node:path";
import fs from "node:fs";
import { pino } from "pino";
import { env } from "@/common/utils/envConfig";

import { RAGService } from "@/application/services/meetingRecords/ragService";
import { OpenAIMeetingQuery } from "@/infrastructure/llm/openatiMeetingQuery";
import { ChromaVectorRepository } from "@/infrastructure/database/chroma/chromaVectorRespository";
import { OpenAIEmbeddings } from "@/infrastructure/embedding/openaiembedding";

function getLogFileName() {
	const now = new Date();
	const date = now.toISOString().split("T")[0]; // YYYY-MM-DD
	const time = now.toTimeString().split(" ")[0].replace(/:/g, "-"); // HH-MM-SS
	return `logs_rag_${date}_${time}.json`;
}

const logsDir = path.resolve(__dirname, "../../logs");
if (!fs.existsSync(logsDir)) {
	fs.mkdirSync(logsDir);
}

const logFilePath = path.join(logsDir, getLogFileName());
const logStream = fs.createWriteStream(logFilePath, { flags: "a" });

const logger = pino({ name: "rag begin", level: "debug" }, logStream);

async function main() {
	const [, , query] = process.argv;

	if (!query) {
		console.error("Usage: npm run query <query>");
		process.exit(1);
	}

	try {
		const embeddingGenerator = new OpenAIEmbeddings(env.OPENAI_API_KEY);
		const openAIMeetingQuery = new OpenAIMeetingQuery(env.OPENAI_API_KEY);
		const chromaVectorRespository = new ChromaVectorRepository();

		const ragService = new RAGService(chromaVectorRespository, embeddingGenerator, openAIMeetingQuery, logger);

		const response = await ragService.query(query);

		console.log(response);

		logger.info("Success!");
	} catch (e) {
		const errorMessage = `Error in rag pipeline: ${(e as Error).message}`;
		logger.error("Error:", e);
		console.error("Error:", errorMessage);
		process.exit(1);
	}
}

main();
