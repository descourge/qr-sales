import {
  ChatConversation,
  ChatMessage,
  ChatUser,
  CreateConversationPayload,
  SendMessagePayload,
} from "@/features/chat/types/chat";

/* ===========================================
   UTILIDAD DE RESPUESTAS
=========================================== */

async function parseResponse<T>(
  response: Response
): Promise<T> {

  const data =
    await response.json();

  if (!response.ok) {

    throw new Error(
      data.message ??
      "Ocurrió un error inesperado."
    );

  }

  return data;

}

/* ===========================================
   USUARIOS
=========================================== */

export async function getChatUsers(
  companyId: number,
  userId: number
): Promise<ChatUser[]> {

  const params =
    new URLSearchParams({
      companyId:
        String(companyId),

      userId:
        String(userId),
    });

  const response =
    await fetch(
      `/api/chat/users?${params.toString()}`,
      {
        cache: "no-store",
      }
    );

  return parseResponse<
    ChatUser[]
  >(response);

}

/* ===========================================
   CONVERSACIONES
=========================================== */

export async function getConversations(
  companyId: number,
  userId: number
): Promise<ChatConversation[]> {

  const params =
    new URLSearchParams({
      companyId:
        String(companyId),

      userId:
        String(userId),
    });

  const response =
    await fetch(
      `/api/chat/conversations?${params.toString()}`,
      {
        cache: "no-store",
      }
    );

  return parseResponse<
    ChatConversation[]
  >(response);

}

export async function createConversation(
  payload: CreateConversationPayload
): Promise<{
  id: number;
}> {

  const response =
    await fetch(
      "/api/chat/conversations",
      {
        method:
          "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify(
            payload
          ),
      }
    );

  return parseResponse<{
    id: number;
  }>(response);

}

/* ===========================================
   MENSAJES
=========================================== */

export async function getMessages(
  conversationId: number,
  companyId: number,
  userId: number,
  afterId?: number
): Promise<ChatMessage[]> {

  const params =
    new URLSearchParams({
      companyId:
        String(companyId),

      userId:
        String(userId),
    });

  if (afterId) {

    params.set(
      "afterId",
      String(afterId)
    );

  }

  const response =
    await fetch(
      `/api/chat/conversations/${conversationId}/messages?${params.toString()}`,
      {
        cache: "no-store",
      }
    );

  return parseResponse<
    ChatMessage[]
  >(response);

}

export async function sendMessage(
  conversationId: number,
  payload: SendMessagePayload
): Promise<ChatMessage> {

  const response =
    await fetch(
      `/api/chat/conversations/${conversationId}/messages`,
      {
        method:
          "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify(
            payload
          ),
      }
    );

  return parseResponse<
    ChatMessage
  >(response);

}