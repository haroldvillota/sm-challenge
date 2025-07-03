import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import express from "express";
import { JokeController } from "@/infrastructure/api/joke/jokeController";
import { jokeRouter } from "@/infrastructure/api/joke/jokeRouter";
import type { JokeService } from "@/application/services/jokeService";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { Joke } from "@/domain/entities/jokeEntity";

// Mock del JokeService
const mockJokeService: JokeService = {
	findOneRandom: vi.fn(),
	listJokes: vi.fn(),
	createJoke: vi.fn(),
	updateJoke: vi.fn(),
	deleteJoke: vi.fn(),
} as unknown as JokeService;

// Mock del JokeController
const mockController: JokeController = new JokeController(mockJokeService);

describe("Joke Router", () => {
	let app: express.Express;

	beforeEach(() => {
		app = express();
		app.use(express.json());
		app.use("/joke", jokeRouter(mockController));
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe("GET /joke", () => {
		it("should return a joke", async () => {
			const mockJoke = Joke.create("Chuck Norris joke");

			vi.mocked(mockJokeService.findOneRandom).mockResolvedValue(ServiceResponse.success("Joke found", mockJoke));

			const response = await request(app).get("/joke");

			expect(response.status).toBe(200);
			expect(response.body).toEqual({
				success: true,
				message: "Joke found",
				responseObject: expect.objectContaining({ value: "Chuck Norris joke" }),
				statusCode: 200,
			});
			expect(mockJokeService.findOneRandom).toHaveBeenCalled();
		});

		it("should handle errors when get a joke", async () => {
			vi.mocked(mockJokeService.findOneRandom).mockResolvedValue(ServiceResponse.failure("Error occurred", null, 500));

			const response = await request(app).get("/joke");

			expect(response.status).toBe(500);
			expect(response.body).toEqual({
				success: false,
				message: "Error occurred",
				responseObject: null,
				statusCode: 500,
			});
			expect(mockJokeService.findOneRandom).toHaveBeenCalled();
		});
	});

	describe("GET /joke/:source", () => {
		it("should return a random joke from specified source", async () => {
			const mockJoke = Joke.create("Chuck Norris joke");

			vi.mocked(mockJokeService.findOneRandom).mockResolvedValue(ServiceResponse.success("Joke found", mockJoke));

			const response = await request(app).get("/joke/chuck");

			expect(response.status).toBe(200);
			expect(response.body).toEqual({
				success: true,
				message: "Joke found",
				responseObject: expect.objectContaining({ value: "Chuck Norris joke" }),
				statusCode: 200,
			});
			expect(mockJokeService.findOneRandom).toHaveBeenCalledWith("chuck");
		});

		it("should return a random joke from any source when no source specified", async () => {
			const mockJoke = Joke.create("Random joke");

			vi.mocked(mockJokeService.findOneRandom).mockResolvedValue(ServiceResponse.success("Joke found", mockJoke));

			const response = await request(app).get("/joke");

			expect(response.status).toBe(200);
			expect(mockJokeService.findOneRandom).toHaveBeenCalledWith(undefined);
		});

		it("should validate source parameter", async () => {
			const response = await request(app).get("/joke/invalid");

			expect(response.status).toBe(400);
		});

		it("should handle errors when fetching joke", async () => {
			vi.mocked(mockJokeService.findOneRandom).mockResolvedValue(ServiceResponse.failure("Error occurred", null, 500));

			const response = await request(app).get("/joke/chuck");

			expect(response.status).toBe(500);
			expect(response.body).toEqual({
				success: false,
				message: "Error occurred",
				responseObject: null,
				statusCode: 500,
			});
		});
	});

	describe("POST /joke", () => {
		it("should create a new joke", async () => {
			const mockJoke = Joke.create("New joke");

			vi.mocked(mockJokeService.createJoke).mockResolvedValue(ServiceResponse.success("Created Joke", mockJoke));

			const response = await request(app).post("/joke").query({ value: "New joke" });

			expect(response.status).toBe(200);
			expect(response.body).toEqual({
				success: true,
				message: "Created Joke",
				responseObject: expect.objectContaining({ value: "New joke" }),
				statusCode: 200,
			});
			expect(mockJokeService.createJoke).toHaveBeenCalledWith("New joke");
		});

		it("should validate request body", async () => {
			const response = await request(app).post("/joke").query({ invalid: "data" });

			expect(response.status).toBe(400);
		});

		it("should handle errors when creating joke", async () => {
			vi.mocked(mockJokeService.createJoke).mockResolvedValue(ServiceResponse.failure("Error occurred", null, 500));

			const response = await request(app).post("/joke").query({ value: "New joke" });

			expect(response.status).toBe(500);
			expect(response.body).toEqual({
				success: false,
				message: "Error occurred",
				responseObject: null,
				statusCode: 500,
			});
		});
	});

	describe("PUT /joke", () => {
		it("should update an existing joke", async () => {
			const mockJoke = Joke.recreate(1, "Updated joke");

			vi.mocked(mockJokeService.updateJoke).mockResolvedValue(ServiceResponse.success("Updated Joke", mockJoke));

			const response = await request(app).put("/joke").query({ number: "1", value: "Updated joke" });

			expect(response.status).toBe(200);
			expect(response.body).toEqual({
				success: true,
				message: "Updated Joke",
				responseObject: expect.objectContaining({
					id: 1,
					value: "Updated joke",
				}),
				statusCode: 200,
			});
			expect(mockJokeService.updateJoke).toHaveBeenCalledWith(1, "Updated joke");
		});

		it("should validate request body", async () => {
			const response = await request(app).put("/joke").query({ invalid: "data" });

			expect(response.status).toBe(400);
			expect(response.body).toEqual({
				success: false,
				message: "Invalid input: Required, Required",
				responseObject: null,
				statusCode: 400,
			});
		});

		it("should handle errors when updating joke", async () => {
			vi.mocked(mockJokeService.updateJoke).mockResolvedValue(ServiceResponse.failure("Error occurred", null, 500));

			const response = await request(app).put("/joke").query({ number: "1", value: "Updated joke" });

			expect(response.status).toBe(500);
			expect(response.body).toEqual({
				success: false,
				message: "Error occurred",
				responseObject: null,
				statusCode: 500,
			});
		});
	});

	describe("DELETE /joke", () => {
		it("should delete an existing joke", async () => {
			vi.mocked(mockJokeService.deleteJoke).mockResolvedValue(ServiceResponse.success("Deleted Joke", true));

			const response = await request(app).delete("/joke").query({ number: "1" });

			expect(response.status).toBe(200);
			expect(response.body).toEqual({
				success: true,
				message: "Deleted Joke",
				responseObject: true,
				statusCode: 200,
			});
			expect(mockJokeService.deleteJoke).toHaveBeenCalledWith(1);
		});

		it("should validate request body", async () => {
			const response = await request(app).delete("/joke").query({ invalid: "data" });

			expect(response.status).toBe(400);
			expect(response.body).toEqual({
				success: false,
				message: "Invalid input: Required",
				responseObject: null,
				statusCode: 400,
			});
		});

		it("should handle errors when deleting joke", async () => {
			vi.mocked(mockJokeService.deleteJoke).mockResolvedValue(ServiceResponse.failure("Error occurred", false, 500));

			const response = await request(app).delete("/joke").query({ number: "1" });

			expect(response.status).toBe(500);
			expect(response.body).toEqual({
				success: false,
				message: "Error occurred",
				responseObject: false,
				statusCode: 500,
			});
		});
	});
});
