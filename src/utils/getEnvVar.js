import dotenv from 'dotenv';

dotenv.config();

export function getEnvVar(name, port) {
  const value = process.env[name];

  if (value) return value;

  if (port) return port;

  throw new Error(`Missing: process.env['${name}']`);
}
