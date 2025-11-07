import createHttpError from 'http-errors';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constans/index.js';
import {
  loginUser,
  refreshUserSession,
  registerUser,
} from '../services/auth.js';
import { getEnvVar } from '../utils/getEnvVar.js';

const isSecure = getEnvVar('IS_SECURE') === 'production';

function setupSession(res, session) {
  res.cookie('accessToken', session.accessToken, {
    httpOnly: true,
    secure: isSecure,
    sameSite: isSecure ? 'none' : 'lax',
    path: '/',
    expires: new Date(Date.now() + FIFTEEN_MINUTES),
  });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    secure: isSecure,
    sameSite: isSecure ? 'none' : 'lax',
    path: '/',
    expires: new Date(Date.now() + ONE_DAY),
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    secure: isSecure,
    sameSite: isSecure ? 'none' : 'lax',
    path: '/',
    expires: new Date(Date.now() + ONE_DAY),
  });
}

export async function registerUserController(req, res) {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
}

export async function loginUserController(req, res) {
  const session = await loginUser(req.body);

  setupSession(res, session);

  res.status(200).json({
    status: 200,
    message: 'Login successful',
    data: {
      accessToken: session.accessToken,
    },
  });
}

export async function logoutUserController(req, res) {
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: isSecure,
    sameSite: isSecure ? 'none' : 'lax',
    path: '/',
  });

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: isSecure,
    sameSite: isSecure ? 'none' : 'lax',
    path: '/',
  });

  res.clearCookie('sessionId', {
    httpOnly: true,
    secure: isSecure,
    sameSite: isSecure ? 'none' : 'lax',
    path: '/',
  });

  res.status(204).send();
}

export async function refreshUserSessionController(req, res) {
  const { sessionId, refreshToken } = req.cookies;

  if (!sessionId || !refreshToken) {
    throw createHttpError(401, 'Session credentials missing');
  }

  const session = await refreshUserSession({ sessionId, refreshToken });

  setupSession(res, session);

  return res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
}
