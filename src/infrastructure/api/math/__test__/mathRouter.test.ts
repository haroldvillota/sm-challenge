import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import express from "express";
import { MathController } from "@/infrastructure/api/math/mathController";
import { mathRouter } from "@/infrastructure/api/math/mathRouter";
import type { MathService } from "@/application/services/mathService";
import { ServiceResponse } from "@/common/models/serviceResponse";

// Mock del MathService
const mockMathService: MathService = {
	calculateMcm: vi.fn(),
} as unknown as MathService;

// Mock del MathController
const mockController: MathController = new MathController(mockMathService);

describe("Math Router", () => {
	let app: express.Express;

	beforeEach(() => {
		app = express();
		app.use(express.json());
		app.use("/", mathRouter(mockController));
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe("GET /mcm", () => {
		it("should return the LCM of the numbers", async () => {
			vi.mocked(mockMathService.calculateMcm).mockResolvedValue(
				ServiceResponse.success("MCM calculated successfully", 60),
			);

			const response = await request(app).get("/mcm").query({ numbers: "5,12,15" });

			expect(response.status).toBe(200);
			expect(response.body).toEqual({
				success: true,
				message: "MCM calculated successfully",
				responseObject: 60,
				statusCode: 200,
			});
			expect(mockMathService.calculateMcm).toHaveBeenCalledWith([5, 12, 15]);
		});

		it("should validate the numbers query param", async () => {
			const response = await request(app).get("/mcm").query({ numbers: "5,abc,15" });

			expect(response.status).toBe(400);
		});

		it("should handle empty numbers", async () => {
			vi.mocked(mockMathService.calculateMcm).mockResolvedValue(
				ServiceResponse.failure("At least one number is required", 0, 400),
			);

			const response = await request(app).get("/mcm").query({ numbers: "" });

			expect(response.status).toBe(400);
			expect(response.body).toEqual({
				success: false,
				message: "Invalid input: Numbers must be a comma-separated list of integers",
				responseObject: null,
				statusCode: 400,
			});
		});

		it("should handle service errors", async () => {
			vi.mocked(mockMathService.calculateMcm).mockResolvedValue(
				ServiceResponse.failure("Internal server error", 0, 500),
			);

			const response = await request(app).get("/mcm").query({ numbers: "5,12,15" });

			expect(response.status).toBe(500);
			expect(response.body).toEqual({
				success: false,
				message: "Internal server error",
				responseObject: 0,
				statusCode: 500,
			});
		});
	});
});
