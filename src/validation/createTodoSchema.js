import Joi from 'joi';
import { TODO_STATUS } from '../constans/index.js';
import { isValidObjectId } from 'mongoose';

export const createTodoSchema = Joi.object({
  name: Joi.string().min(5).required(),
  description: Joi.string().min(5).required(),
  status: Joi.string()
    .valid(...Object.values(TODO_STATUS))
    .default(TODO_STATUS.TODO)
    .required(),
  userId: Joi.string().custom((value, helper) => {
    const isValidId = isValidObjectId(value);

    if (!isValidId) {
      return helper.message('Not valid userId');
    }

    return value;
  }),
});
