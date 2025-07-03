import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/common/models/serviceResponse";
import type { Joke } from "@/domain/entities/jokeEntity";

export function mockSuccessResponse<T>(data: T, message = "Success", statusCode = StatusCodes.OK) {
	return ServiceResponse.success(message, data, statusCode);
}

export function mockFailureResponse(message = "Error", statusCode = StatusCodes.BAD_REQUEST) {
	return ServiceResponse.failure(message, null, statusCode);
}

export function mockJokeSuccessResponse(joke: Joke, message = "Joke operation successful") {
	return mockSuccessResponse(joke, message);
}
