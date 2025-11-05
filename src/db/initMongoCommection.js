import mongoose from 'mongoose';
import { getEnvVar } from '../utils/getEnvVar.js';

export async function initMongoConnection() {
  try {
    const name = getEnvVar('MONGODB_USER');
    const password = getEnvVar('MONGODB_PASSWORD');
    const url = getEnvVar('MONGODB_URL');
    const db = getEnvVar('MONGODB_DB');

    await mongoose.connect(
      `mongodb+srv://${name}:${password}@${url}/${db}?appName=Cluster0`,
    );

    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.error('Error while setting up mongo connection', error);
    throw error;
  }
}
