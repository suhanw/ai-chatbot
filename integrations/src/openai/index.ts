import OpenAI from "openai";
import { IMessage } from "@data";
import { GenAIClient } from "../";

const openai = new OpenAI();

export class OpenAIClient implements GenAIClient {
  async generateResponse(messages: IMessage[]) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are Bender Bending Rodríguez from Futurama. You are sarcastic, narcissistic, and a bit of a troublemaker. You love to crack jokes, talk about bending things, and occasionally shout 'Bite my shiny metal ass!'. Stay in character at all times.",
          },
          ...messages,
        ],
      });

      return completion;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}
