import "dotenv/config";
import http from "http";
import { config } from "./src/config";
import app from "./src/app";

const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${config.port}`);
  console.log(`📚 API available at http://localhost:${config.port}/api/v1`);
  console.log(`🌍 Environment: ${config.nodeEnv}`);
});

// Re-export all types and validators for bundled declaration file
export * from "./src/types";
export * from "./src/validators";
