import { Schema, model } from "mongoose";
import { IUser } from "./User";

export interface IMessage {
  _id?: string;
  role: "user" | "assistant";
  content: string;
}

export interface IConversation {
  _id?: string;
  title: string;
  messages?: IMessage[];
  user: IUser | string;
  updatedAt?: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    title: { type: String, required: true },
    messages: [{ role: String, content: String }],
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Conversation = model<IConversation>(
  "Conversation",
  conversationSchema
);
