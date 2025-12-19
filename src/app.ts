import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from "./config";
import routes from "./routes";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";

const app = express();

// Middleware
app.use(cors(config.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/v1', routes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
  console.log(`🚀 Server running on http://localhost:${config.port}`);
  console.log(`📚 API available at http://localhost:${config.port}/api/v1`);
  console.log(`🌍 Environment: ${config.nodeEnv}`);
});

export default app;

// Re-export all types and validators for bundled declaration file
export * from "./types";
export * from "./validators";

