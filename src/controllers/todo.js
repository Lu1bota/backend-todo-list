import createHttpError from 'http-errors';
import {
  createTodo,
  deleteTodo,
  getTodoById,
  getTodos,
  updateTodo,
} from '../services/todo.js';

export async function getTodosController(req, res, next) {
  const { id } = req.user;
  const todos = await getTodos(id);

  res.status(200).json({
    status: 200,
    message: 'Successfully found todos!',
    data: todos,
  });
}

export async function getTodoByIdController(req, res, next) {
  const { id } = req.user;
  const { todoId } = req.params;
  const todo = await getTodoById(todoId, id);

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${todoId}!`,
    data: todo,
  });
}

export async function createTodoController(req, res) {
  const { id } = req.user;

  const payload = { ...req.body, userId: id };

  const todo = await createTodo(payload);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: todo,
  });
}

export async function updateTodoController(req, res) {
  const { todoId } = req.params;
  const { id } = req.user;

  const todo = await updateTodo(todoId, id, req.body);

  if (!todo) throw createHttpError(404, 'Contact not found');

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: todo,
  });
}

export async function deleteTodoController(req, res) {
  const { todoId } = req.params;
  const { id } = req.user;

  const todo = await deleteTodo(todoId, id);

  if (!todo) throw createHttpError(404, 'Todo not found');

  res.status(204).send();
}
