import createHttpError from 'http-errors';
import { UserCollection } from '../db/models/user.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getEnvVar } from '../utils/getEnvVar.js';
import { SessionsCollection } from '../db/models/session.js';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constans/index.js';

function createSession(user) {
  const accessToken = jwt.sign(
    { id: user._id, email: user.email },
    getEnvVar('JWT_SECRET'),
    {
      expiresIn: FIFTEEN_MINUTES,
    },
  );
  const refreshToken = jwt.sign(
    { id: user._id, email: user.email },
    getEnvVar('REFRESH_JWT_SECRET'),
    { expiresIn: ONE_DAY },
  );

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  };
}

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

  await SessionsCollection.deleteOne({ userId: user._id });

  const accessToken = jwt.sign(
    { id: user._id, email: payload.email },
    getEnvVar('JWT_SECRET'),
    {
      expiresIn: FIFTEEN_MINUTES,
    },
  );
  const refreshToken = jwt.sign(
    { id: user._id, email: payload.email },
    getEnvVar('REFRESH_JWT_SECRET'),
    { expiresIn: ONE_DAY },
  );

  return await SessionsCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });
}

export async function refreshUserSession({ sessionId, refreshToken }) {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) throw createHttpError(401, 'Session not found');

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  const user = await UserCollection.findOne({ _id: session.userId });

  if (!user) throw createHttpError(401, 'User not found');

  const newSession = createSession(user);

  await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });

  return await SessionsCollection.create({
    userId: session.userId,
    ...newSession,
  });
}
