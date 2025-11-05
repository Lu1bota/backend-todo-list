import { initMongoConnection } from './db/initMongoCommection.js';
import { setupServer } from './server.js';

async function bootstrap() {
  await initMongoConnection();
  setupServer();
}

bootstrap();
