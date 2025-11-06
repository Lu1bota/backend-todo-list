import { loginUser, registerUser } from '../services/auth.js';
import { getEnvVar } from '../utils/getEnvVar.js';

const isSecure = getEnvVar('IS_SECURE') === 'production';

export async function registerUserController(req, res) {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
}

export async function loginUserController(req, res) {
  const token = await loginUser(req.body);

  res.cookie('token', token, {
    httpOnly: true,
    secure: isSecure,
    sameSite: isSecure ? 'none' : 'lax',
    path: '/',
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    status: 200,
    message: 'Login successful',
  });
}

export async function logoutUserController(req, res) {
  res.clearCookie('token', {
    httpOnly: true,
    secure: isSecure,
    sameSite: isSecure ? 'none' : 'lax',
    path: '/',
  });

  res.status(204).send();
}
