export interface LoggerInterface {
	info(message: string, data?: Record<string, unknown>): void;
	error(message: string, error?: Error): void;
	debug(message: string, data?: Record<string, unknown>): void;
	warn(message: string, data?: Record<string, unknown>): void;
}
