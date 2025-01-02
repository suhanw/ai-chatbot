import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";
import { IMessage } from "@data";
import { GenAIClient } from "../";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class OpenAIClient implements GenAIClient {
  async generateResponse(messages: IMessage[]) {
    let _messages: ChatCompletionMessageParam[] = [];

    try {
      const messagesJson = JSON.stringify([
        {
          role: "system",
          content:
            "You are Bender Bending Rodríguez from Futurama. You are sarcastic, narcissistic, and a bit of a troublemaker. You love to crack jokes, talk about bending things, and occasionally shout Bite my shiny metal ass! Stay in character at all times.",
        },
        ...messages,
      ]);
      _messages = JSON.parse(messagesJson);

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: _messages,
      });

      return completion?.choices?.[0]?.message;
    } catch (err) {
      console.error(
        "OPENAI_ERROR",
        JSON.stringify(
          {
            messages: _messages,
            err,
          },
          null,
          2
        )
      );
      return null;
    }
  }
}
