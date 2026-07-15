export interface ChatUser {
  id: number;
  name: string;
  role: string;
  branch?: {
    id: number;
    name: string;
  } | null;
}

export interface ChatMessage {
  id: number;
  conversationId: number;
  senderId: number;
  content: string;
  createdAt: string;

  sender: {
    id: number;
    name: string;
  };
}

export interface ChatConversation {
  id: number;
  companyId: number;
  createdAt: string;
  updatedAt: string;

  otherUser: ChatUser;

  lastMessage: ChatMessage | null;
}

export interface CreateConversationPayload {
  companyId: number;
  userId: number;
  targetUserId: number;
}

export interface SendMessagePayload {
  companyId: number;
  userId: number;
  content: string;
}