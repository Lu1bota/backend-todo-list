import { Router } from 'express';
import { todoRouter } from './todo.js';
import { authRouter } from './auth.js';

const router = Router();

router.use('/todos', todoRouter);
router.use('/auth', authRouter);

export default router;
