import {
  Application,
  Router,
  RequestHandler,
  ErrorRequestHandler,
} from "express";
import { requireLogin } from "../auth/helpers";
import { IConversationRepo, ConversationRepo } from "@data";
import { GenAIClient, OpenAIClient } from "@integrations";

const conversationRepo: IConversationRepo = new ConversationRepo();
const aiClient: GenAIClient = new OpenAIClient();

export class Conversations {
  constructor(app: Application) {
    const router = Router();
    router.use(requireLogin);
    router.post("/", this.createConversation);
    router.put("/:conversationId", this.updateConversation);
    router.get("/", this.getConversations);
    router.get("/:conversationId", this.getConversation);
    router.delete("/:conversationId", this.deleteConversation);
    router.use(this.handleError);

    app.use("/api/conversations", router);

    console.log("Conversations plugin registered");
  }

  createConversation: RequestHandler = async (req, res, next) => {
    try {
      const { id: userId } = req.session.user || {};
      const { messages, title } = req.body;

      const aiResponse = await aiClient.generateResponse(messages);
      const aiMessage = aiResponse?.choices?.[0]?.message;

      if (!aiMessage) {
        throw {
          status: 502,
          message:
            "Sorry! I'm feeling a bit slow today. Please try again in a minute.",
        };
      }

      const conversation = await conversationRepo.create({
        title,
        messages: [
          ...messages,
          {
            role: aiMessage.role,
            content: aiMessage.content,
          },
        ],
        user: userId,
      });

      if (!conversation) {
        throw { status: 422, message: "Conversation not created." };
      }

      res.json({ data: conversation });
    } catch (err) {
      next(err);
    }
  };

  getConversation: RequestHandler = async (req, res, next) => {
    try {
      const { conversationId } = req.params;
      const { id: userId } = req.session.user || {};
      const conversation = await conversationRepo.findById(
        conversationId,
        userId
      );

      if (!conversation) {
        throw { status: 404, message: "Conversation not found." };
      }

      res.json({ data: conversation });
    } catch (err) {
      next(err);
    }
  };

  getConversations: RequestHandler = async (req, res, next) => {
    try {
      const { id: userId } = req.session.user || {};

      const conversations = await conversationRepo.findByUser(userId);

      res.json({ data: conversations });
    } catch (err) {
      next(err);
    }
  };

  updateConversation: RequestHandler = async (req, res, next) => {
    try {
      const { id: userId } = req.session.user || {};
      const { conversationId } = req.params;
      const { title, messages } = req.body;
      let conversation;

      if (messages?.length) {
        const aiResponse = await aiClient.generateResponse(messages);
        const aiMessage = aiResponse?.choices?.[0]?.message;

        if (!aiMessage) {
          throw {
            status: 502,
            message:
              "Sorry! I'm feeling a bit slow today. Please try again in a minute.",
          };
        }

        conversation = await conversationRepo.update({
          _id: conversationId,
          user: userId,
          title,
          messages: [
            ...messages,
            {
              role: aiMessage.role,
              content: aiMessage.content,
            },
          ],
        });
      } else {
        conversation = await conversationRepo.update({
          _id: conversationId,
          user: userId,
          title,
        });
      }

      if (!conversation) {
        throw { status: 422, message: "Conversation not updated." };
      }

      res.json({ data: conversation });
    } catch (err) {
      next(err);
    }
  };

  deleteConversation: RequestHandler = async (req, res, next) => {
    const { id: userId } = req.session.user || {};
    const { conversationId } = req.params;
    try {
      const data = await conversationRepo.deleteById(conversationId, userId);
      res.json({ data });
    } catch (err) {
      next(err);
    }
  };

  handleError: ErrorRequestHandler = (err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).send(err.message);
  };
}
