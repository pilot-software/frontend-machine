type Environment = "dev" | "prod";

interface ServerConfig {
  baseUrl: string;
  apiUrl: string;
  authUrl: string;
  fileUploadUrl: string;
  websocketUrl: string;
}

const configs: Record<Environment, ServerConfig> = {
  dev: {
    baseUrl: "http://localhost:3000",
    apiUrl: "http://localhost:8080/api",
    authUrl: "http://localhost:8080/api/auth",
    fileUploadUrl: "http://localhost:8080/api/upload",
    websocketUrl: "ws://localhost:8080/ws",
  },
  prod: {
    baseUrl: "https://healthcare.example.com",
    apiUrl: "https://api.healthcare.example.com/v1",
    authUrl: "https://auth.healthcare.example.com",
    fileUploadUrl: "https://files.healthcare.example.com",
    websocketUrl: "wss://ws.healthcare.example.com",
  },
};

// Set environment here
const ENVIRONMENT: Environment = "dev";

export const serverConfig = configs[ENVIRONMENT];
export { type Environment, type ServerConfig };
