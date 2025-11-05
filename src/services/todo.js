import { TodoCollection } from '../db/models/todo.js';

export async function getTodos() {
  const todos = await TodoCollection.find().sort({ _id: -1 });

  return todos;
}

export async function getTodoById(todoId) {
  const todo = await TodoCollection.findById(todoId);

  return todo;
}

export async function createTodo(payload) {
  const todo = await TodoCollection.create(payload);

  return todo;
}

export async function updateTodo(todoId, payload) {
  const todo = await TodoCollection.findByIdAndUpdate(todoId, payload, {
    new: true,
  });

  return todo;
}

export async function deleteTodo(todoId) {
  const todo = await TodoCollection.findByIdAndDelete(todoId);

  return todo;
}
