import { Router } from 'express';
import { authSchema } from '../validation/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  loginUserController,
  logoutUserController,
  refreshUserSessionController,
  registerUserController,
} from '../controllers/auth.js';

export const authRouter = Router();

authRouter.post('/register', validateBody(authSchema), registerUserController);
authRouter.post('/login', validateBody(authSchema), loginUserController);
authRouter.post('/logout', logoutUserController);
authRouter.post('/refresh', refreshUserSessionController);
