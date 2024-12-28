import { DeleteResult } from "mongoose";
import { IConversation, Conversation } from "../models/Conversation";

export interface IConversationRepo {
  create: (conversation: IConversation) => Promise<IConversation>;
  findByUser: (userId: string) => Promise<IConversation[]>;
  findById: (
    conversationId: string,
    userId: string
  ) => Promise<IConversation | null>;
  update: (conversation: IConversation) => Promise<IConversation | null>;
  deleteById: (conversationId: string, userId: string) => Promise<DeleteResult>;
}

export class ConversationRepo implements IConversationRepo {
  async create(conversation: IConversation) {
    return await Conversation.create(conversation);
  }

  async update(conversation: IConversation) {
    return await Conversation.findOneAndUpdate(
      { _id: conversation._id },
      conversation,
      { new: true } // return the updated conversation
    ).exec();
  }

  async findById(conversationId: string, userId: string) {
    return await Conversation.findOne({
      _id: conversationId,
      user: userId,
    }).exec();
  }

  async findByUser(userId: string) {
    return await Conversation.find(
      { user: userId },
      ["_id", "title", "updatedAt"],
      { sort: { updatedAt: -1 } } // most recent conversations first
    ).exec();
  }

  async deleteById(conversationId: string, userId: string) {
    return await Conversation.deleteOne({
      _id: conversationId,
      user: userId,
    });
  }
}
