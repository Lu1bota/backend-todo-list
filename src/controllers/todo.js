import createHttpError from 'http-errors';
import {
  createTodo,
  deleteTodo,
  getTodoById,
  getTodos,
  updateTodo,
} from '../services/todo.js';

export async function getTodosController(req, res, next) {
  const todos = await getTodos();

  res.status(200).json({
    status: 200,
    message: 'Successfully found todos!',
    data: todos,
  });
}

export async function getTodoByIdController(req, res, next) {
  const { todoId } = req.params;
  const todo = await getTodoById(todoId);

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${todoId}!`,
    data: todo,
  });
}

export async function createTodoController(req, res) {
  const todo = await createTodo(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: todo,
  });
}

export async function updateTodoController(req, res) {
  const { todoId } = req.params;

  const todo = await updateTodo(todoId, req.body);

  if (!todo) throw createHttpError(404, 'Contact not found');

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: todo,
  });
}

export async function deleteTodoController(req, res) {
  const { todoId } = req.params;

  const todo = await deleteTodo(todoId);

  if (!todo) throw createHttpError(404, 'Todo not found');

  res.status(204).send();
}
