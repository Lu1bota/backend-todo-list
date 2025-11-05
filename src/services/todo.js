import { TodoCollection } from '../db/models/todo.js';

export async function getTodos(userId, filter = {}) {
  const query = {
    $or: [{ userId: userId }, { userId: { $exists: false } }],
  };

  const { status } = filter;
  if (status) query.status = status;

  const todos = await TodoCollection.find(query).sort({ _id: -1 });

  return todos;
}

export async function getTodoById(todoId, userId) {
  const todo = await TodoCollection.findById(todoId);

  if (!todo) {
    return null;
  }

  if (!todo.userId) {
    return todo;
  }

  if (todo.userId.toString() === userId.toString()) {
    return todo;
  }

  return null;
}

export async function createTodo(payload) {
  const todo = await TodoCollection.create(payload);

  return todo;
}

export async function updateTodo(todoId, userId, payload) {
  const todo = await TodoCollection.findByIdAndUpdate(
    { _id: todoId, userId: userId },
    payload,
    {
      new: true,
    },
  );

  return todo;
}

export async function deleteTodo(todoId, userId) {
  const todo = await TodoCollection.findByIdAndDelete({
    _id: todoId,
    userId: userId,
  });

  return todo;
}
