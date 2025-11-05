import createHttpError from 'http-errors';
import { UserCollection } from '../db/models/user.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getEnvVar } from '../utils/getEnvVar.js';

export async function registerUser(payload) {
  const user = await UserCollection.findOne({ email: payload.email });

  if (user) throw createHttpError(409, 'Email in use');

  const encryptedPassword = await bcryptjs.hash(payload.password, 10);

  return await UserCollection.create({
    ...payload,
    password: encryptedPassword,
  });
}

export async function loginUser(payload) {
  const user = await UserCollection.findOne({ email: payload.email });

  if (!user) throw createHttpError(401, 'User not found');

  const userPassword = await bcryptjs.compare(payload.password, user.password);

  if (!userPassword) throw createHttpError(401, 'Invalid email or password');

  const token = jwt.sign({ id: user._id }, getEnvVar('JWT_SECRET'));

  return token;
}
