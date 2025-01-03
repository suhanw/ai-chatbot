import { Schema, model } from "mongoose";

export interface IUser {
  _id?: string;
  email: string;
  hashedPassword: Buffer;
  salt: Buffer;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    hashedPassword: { type: Buffer, required: true },
    salt: { type: Buffer, required: true },
  },
  {
    timestamps: true,
  }
);

export const User = model<IUser>("User", userSchema);
