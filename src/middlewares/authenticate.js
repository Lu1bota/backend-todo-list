import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { getEnvVar } from '../utils/getEnvVar.js';
import { UserCollection } from '../db/models/user.js';

export const authenticate = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    throw createHttpError(401, 'Authentication token missing');
  }

  try {
    const payload = jwt.verify(token, getEnvVar('JWT_SECRET'));

    const user = await UserCollection.findById(payload.id);

    if (!user) throw createHttpError(401, 'User not found');

    req.user = user;

    next();
  } catch {
    throw createHttpError(401, 'Token invalid or expired');
  }
};
