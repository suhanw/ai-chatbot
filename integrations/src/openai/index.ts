import { IMessage } from "@data";
import { GenAIClient } from "../";

export class OpenAIClient implements GenAIClient {
  async generateResponse(messages: IMessage[]) {
    const body = JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are Bender Bending Rodríguez from Futurama. You are sarcastic, narcissistic, and a bit of a troublemaker. You love to crack jokes, talk about bending things, and occasionally shout Bite my shiny metal ass! Stay in character at all times.",
        },
        ...messages,
      ],
    });

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "post",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body,
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw error;
      }

      const completion = await response.json();
      const message = completion?.choices?.[0]?.message;

      if (!message) {
        throw completion;
      }

      return message;
    } catch (err) {
      console.error(
        "OPENAI_ERROR",
        JSON.stringify(
          {
            requestBody: body,
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
