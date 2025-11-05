import { model, Schema } from 'mongoose';

const todoSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['todo', 'in progress', 'done'],
      default: 'todo',
    },
    // userId: {
    //   type: Schema.Types.ObjectId,
    //   required: true,
    // },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const TodoCollection = model('todo', todoSchema, 'todo');
