import { env } from "@/common/utils/envConfig";
import { app, logger } from "@/server";
import { pool, initializeDatabase } from "@/infrastructure/database/postgres";

async function startServer() {
	try {
		await initializeDatabase();
		console.log("Database ready");
	} catch (error) {
		console.error("Failed to initialize database:", error);
		process.exit(1); // Termina la aplicación si falla
	}

	const server = app.listen(env.PORT, () => {
		const { NODE_ENV, HOST, PORT } = env;
		logger.info(`Server (${NODE_ENV}) running on port http://${HOST}:${PORT}`);
	});

	const onCloseSignal = () => {
		logger.info("sigint received, shutting down");
		server.close(() => {
			logger.info("server closed");
			process.exit();
		});
		setTimeout(() => process.exit(1), 10000).unref(); // Force shutdown after 10s
	};

	process.on("SIGINT", onCloseSignal);
	process.on("SIGTERM", onCloseSignal);
}

startServer().catch(console.error);
