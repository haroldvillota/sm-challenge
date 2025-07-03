import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

export class MathService {
	// Function to calculate the GCD (Greatest Common Divisor)
	private gcd(a: number, b: number): number {
		return b === 0 ? a : this.gcd(b, a % b);
	}

	// Function to calculate the LCM using the GCD
	private lcm(a: number, b: number): number {
		return (a * b) / this.gcd(a, b);
	}

	public calculateMcm(numbers: number[]): ServiceResponse<number> {
		try {
			if (numbers.length === 0) {
				return ServiceResponse.failure("At least one number is required", 0, StatusCodes.BAD_REQUEST);
			}

			if (numbers.some((n) => n <= 0)) {
				return ServiceResponse.failure("All numbers must be positive integers", 0, StatusCodes.BAD_REQUEST);
			}

			let result = numbers[0];
			for (let i = 1; i < numbers.length; i++) {
				result = this.lcm(result, numbers[i]);
			}

			return ServiceResponse.success<number>("MCM calculated successfully", result);
		} catch (ex) {
			const errorMessage = `Error calculating MCM: ${(ex as Error).message}`;
			logger.error(errorMessage);
			return ServiceResponse.failure(errorMessage, 0, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	public incrementNumber(number: number): ServiceResponse<number> {
		try {
			if (number < 0) {
				return ServiceResponse.failure("Number must be a positive integer", 0, StatusCodes.BAD_REQUEST);
			}

			const result = number + 1;
			return ServiceResponse.success<number>("Number incremented successfully", result);
		} catch (ex) {
			const errorMessage = `Error incrementing number: ${(ex as Error).message}`;
			return ServiceResponse.failure(errorMessage, 0, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}
}
