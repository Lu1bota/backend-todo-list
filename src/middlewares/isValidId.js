import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';

export async function isValidId(req, res, next) {
  const { todoId } = req.params;

  if (!isValidObjectId(todoId)) throw createHttpError(400, 'Unknown id');

  next();
}
