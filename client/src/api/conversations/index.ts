import { fetchWrapper } from "../helpers";

import { type IMessage } from "@data";

const GET_CONVERSATIONS_PATH = "/api/conversations";
const GET_CONVERSATION_BY_ID_PATH = "/api/conversations/:conversationId";
const POST_CONVERSATION_PATH = "/api/conversations";
const PUT_CONVERSATION_BY_ID_PATH = "/api/conversations/:conversationId";
const DELETE_CONVERSATION_BY_ID_PATH = "/api/conversations/:conversationId";

export const getConversationsApi = async () => {
  return await fetchWrapper(GET_CONVERSATIONS_PATH);
};

export const getConversationByIdApi = async (conversationId: string) => {
  return await fetchWrapper(
    GET_CONVERSATION_BY_ID_PATH.replace(":conversationId", conversationId)
  );
};

export const postConversationApi = async (conversation: {
  title: string;
  messages?: IMessage[];
}) => {
  return await fetchWrapper(POST_CONVERSATION_PATH, {
    method: "POST",
    body: JSON.stringify(conversation),
  });
};

export const putConversationByIdApi = async (
  conversationId: string,
  conversation: {
    title: string;
    messages?: IMessage[];
  }
) => {
  return await fetchWrapper(
    PUT_CONVERSATION_BY_ID_PATH.replace(":conversationId", conversationId),
    {
      method: "PUT",
      body: JSON.stringify(conversation),
    }
  );
};

export const deleteConversationByIdApi = async (conversationId: string) => {
  return await fetchWrapper(
    DELETE_CONVERSATION_BY_ID_PATH.replace(":conversationId", conversationId),
    {
      method: "DELETE",
    }
  );
};
