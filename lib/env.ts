// Environment configuration for Dev / Prod switching.

export type Environment = "dev" | "prod";

interface EnvConfig {
	label: string;
	backendUrl: string;
}

const DEFAULT_BACKEND = "http://localhost:8124";

const ENV_CONFIGS: Record<Environment, EnvConfig> = {
	dev: {
		label: "Development",
		backendUrl: process.env.BACKEND_URL_DEV ?? DEFAULT_BACKEND,
	},
	prod: {
		label: "Production",
		backendUrl: process.env.BACKEND_URL_PROD ?? DEFAULT_BACKEND,
	},
};

export function getEnvConfig(env: Environment): EnvConfig {
	return ENV_CONFIGS[env];
}

export const DEFAULT_ENV: Environment = "dev";
