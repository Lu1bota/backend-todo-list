import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { getEnvVar } from '../utils/getEnvVar.js';
import { UserCollection } from '../db/models/user.js';
import { SessionsCollection } from '../db/models/session.js';

export const authenticate = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    throw createHttpError(401, 'Authentication token missing');
  }

  try {
    const payload = jwt.verify(accessToken, getEnvVar('JWT_SECRET'));

    const session = await SessionsCollection.findOne({
      accessToken,
    });

    if (!session) throw createHttpError(401, 'Session not found');

    const isAccessTokenExpired =
      new Date() > new Date(session.accessTokenValidUntil);

    if (isAccessTokenExpired)
      throw createHttpError(401, 'Access token expired');

    const user = await UserCollection.findById(payload.id);

    if (!user) throw createHttpError(401, 'User not found');

    req.user = user;

    next();
  } catch {
    throw createHttpError(401, 'Token invalid or expired');
  }
};
