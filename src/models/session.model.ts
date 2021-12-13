import { Schema, model, Document, Mongoose, Types } from "mongoose";

export interface ISession extends Document {
  user: string;
  isValid: boolean;
}

const sessionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      unique: false,
      ref: "User",
    },
    isValid: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  }
);

export const Session = model<ISession>("Session", sessionSchema);
