import dotenv from 'dotenv';
import { getEnvVar } from './utils/getEnvVar.js';
import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { errorHandler } from './middlewares/errorHandler.js';

dotenv.config();

const PORT = Number(getEnvVar('PORT', '3000'));

export function setupServer() {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use((req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
