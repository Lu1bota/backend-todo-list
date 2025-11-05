import Joi from 'joi';
import { TODO_STATUS } from '../constans/index.js';
import { isValidObjectId } from 'mongoose';

export const updateTodoSchema = Joi.object({
  name: Joi.string().min(5),
  description: Joi.string().min(5),
  status: Joi.string()
    .valid(...Object.values(TODO_STATUS))
    .default(TODO_STATUS.TODO),
  userId: Joi.string().custom((value, helper) => {
    const isValidId = isValidObjectId(value);

    if (!isValidId) {
      return helper.message('Not valid userId');
    }

    return value;
  }),
});
