import Joi from 'joi';

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export interface EnvConfig {
  NODE_ENV: Environment;
  DATABASE_URL: string;
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_ACCESS_EXPIRES_IN: number;
  JWT_REFRESH_EXPIRES_DAYS: number;
  COOKIE_ACCESS_TOKEN_MAX_AGE_MS: number;
  COOKIE_REFRESH_TOKEN_MAX_AGE_MS: number;
}

const envSchema: Joi.ObjectSchema<EnvConfig> = Joi.object<EnvConfig, true>({
  NODE_ENV: Joi.string()
    .valid(...Object.values(Environment))
    .default(Environment.Development),

  DATABASE_URL: Joi.string().uri().required(),

  JWT_ACCESS_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),

  JWT_ACCESS_EXPIRES_IN: Joi.number().integer().positive().required(),
  JWT_REFRESH_EXPIRES_DAYS: Joi.number().integer().positive().required(),

  COOKIE_ACCESS_TOKEN_MAX_AGE_MS: Joi.number().integer().positive().required(),
  COOKIE_REFRESH_TOKEN_MAX_AGE_MS: Joi.number().integer().positive().required(),
}).unknown(true);

function runValidation(
  config: Record<string, unknown>,
): Joi.ValidationResult<EnvConfig> {
  const result: Joi.ValidationResult<EnvConfig> = envSchema.validate(config, {
    abortEarly: false,
  });

  return result;
}

export function validateEnvVariables(
  config: Record<string, unknown>,
): EnvConfig {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { error, value } = runValidation(config);

  if (error) {
    console.error('Invalid environment variables:', error.details);
    throw new Error('Invalid environment variables');
  }

  return value;
}
