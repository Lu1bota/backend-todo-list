import { Router } from 'express';
import {
  createTodoController,
  deleteTodoController,
  getTodoByIdController,
  getTodosController,
  updateTodoController,
} from '../controllers/todo.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createTodoSchema } from '../validation/createTodoSchema.js';
import { updateTodoSchema } from '../validation/updateTodoSchema.js';

export const todoRouter = Router();

todoRouter.get('/', getTodosController);
todoRouter.get('/:todoId', isValidId, getTodoByIdController);

todoRouter.post('/', validateBody(createTodoSchema), createTodoController);

todoRouter.patch(
  '/:todoId',
  validateBody(updateTodoSchema),
  isValidId,
  updateTodoController,
);

todoRouter.delete('/:todoId', isValidId, deleteTodoController);
