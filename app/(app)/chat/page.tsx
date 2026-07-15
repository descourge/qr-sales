"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  MessagesSquare,
} from "lucide-react";

import {
  useSession,
} from "@/features/auth/context/SessionProvider";

import {
  createConversation,
  getChatUsers,
  getConversations,
  getMessages,
  sendMessage,
} from "@/features/chat/services/chat.service";

import {
  ChatConversation,
  ChatMessage,
  ChatUser,
} from "@/features/chat/types/chat";

import ChatUserList from "@/features/chat/components/ChatUserList";

import ConversationList from "@/features/chat/components/ConversationList";

import ChatWindow from "@/features/chat/components/ChatWindow";

import {
  notify,
} from "@/shared/lib/notify";

import {
  useSearchParams,
} from "next/navigation";

import {
  ensurePushSubscription,
} from "@/features/push/services/push-client.service";


export default function ChatPage() {

  const {
    session,
  } =
    useSession();

  const [
    users,
    setUsers,
  ] =
    useState<ChatUser[]>([]);

  const [
    conversations,
    setConversations,
  ] =
    useState<
      ChatConversation[]
    >([]);

  const [
    selectedConversation,
    setSelectedConversation,
  ] =
    useState<
      ChatConversation | null
    >(null);

  const [
    messages,
    setMessages,
  ] =
    useState<ChatMessage[]>([]);

  const [
    loadingInitial,
    setLoadingInitial,
  ] =
    useState(true);

  const [
    loadingMessages,
    setLoadingMessages,
  ] =
    useState(false);

  const [
    sending,
    setSending,
  ] =
    useState(false);

    const searchParams =
  useSearchParams();

const requestedConversationId =
  Number(
    searchParams.get(
      "conversationId"
    )
  );
    

  const loadInitialData =
    useCallback(
      async () => {

        if (!session) {

          return;

        }

        setLoadingInitial(true);

        try {

          const [
            usersData,
            conversationsData,
          ] =
            await Promise.all([

              getChatUsers(
                session.company.id,
                session.user.id
              ),

              getConversations(
                session.company.id,
                session.user.id
              ),

            ]);

          setUsers(
            usersData
          );

          setConversations(
            conversationsData
          );

        } catch (error) {

          console.error(error);

          notify.error(
            error instanceof Error
              ? error.message
              : "No fue posible cargar el chat."
          );

        } finally {

          setLoadingInitial(false);

        }

      },
      [session]
    );

  const loadConversationMessages =
    useCallback(
      async (
        conversation:
          ChatConversation,
        showLoading = true
      ) => {

        if (!session) {

          return;

        }

        if (showLoading) {

          setLoadingMessages(true);

        }

        try {

          const data =
            await getMessages(

              conversation.id,

              session.company.id,

              session.user.id

            );

          setMessages(data);

        } catch (error) {

          console.error(error);

          if (showLoading) {

            notify.error(
              "No fue posible cargar los mensajes."
            );

          }

        } finally {

          if (showLoading) {

            setLoadingMessages(false);

          }

        }

      },
      [session]
    );

  useEffect(() => {

    loadInitialData();

  }, [loadInitialData]);

  useEffect(() => {

    if (!selectedConversation) {

      setMessages([]);

      return;

    }

    loadConversationMessages(
      selectedConversation
    );

  }, [
    selectedConversation,
    loadConversationMessages,
  ]);

  useEffect(() => {

  if (
    !requestedConversationId ||
    conversations.length === 0
  ) {

    return;

  }

  const conversation =
    conversations.find(

      item =>

        item.id ===
        requestedConversationId

    );

  if (conversation) {

    setSelectedConversation(
      conversation
    );

  }

}, [

  requestedConversationId,

  conversations,

]);

  /* ==========================
     Polling cada 3 segundos
  ========================== */

  useEffect(() => {

    if (
      !session ||
      !selectedConversation
    ) {

      return;

    }

    const interval =
      window.setInterval(
        async () => {

          try {

            const lastId =
              messages.length > 0
                ? messages[
                    messages.length -
                      1
                  ].id
                : undefined;

            const newMessages =
              await getMessages(

                selectedConversation.id,

                session.company.id,

                session.user.id,

                lastId

              );

            if (
              newMessages.length === 0
            ) {

              return;

            }

            setMessages(current => {

              const knownIds =
                new Set(
                  current.map(
                    message =>
                      message.id
                  )
                );

              const unique =
                newMessages.filter(
                  message =>
                    !knownIds.has(
                      message.id
                    )
                );

              return [
                ...current,
                ...unique,
              ];

            });

            const updated =
              await getConversations(

                session.company.id,

                session.user.id

              );

            setConversations(
              updated
            );

          } catch (error) {

            console.error(
              "No fue posible actualizar el chat:",
              error
            );

          }

        },
        3000
      );

    return () => {

      window.clearInterval(
        interval
      );

    };

  }, [
    session,
    selectedConversation,
    messages,
  ]);
  

async function handleStartConversation(
  user: ChatUser
) {

  if (!session) {

    return;

  }

  const companyId =
    session.company.id;

  const currentUserId =
    session.user.id;

  try {

    const result =
      await createConversation({

        companyId,

        userId:
          currentUserId,

        targetUserId:
          user.id,

      });

    const updated =
      await getConversations(
        companyId,
        currentUserId
      );

    setConversations(
      updated
    );

    const conversation =
      updated.find(
        item =>
          item.id ===
          result.id
      );

    if (!conversation) {

      notify.error(
        "La conversación no pudo cargarse."
      );

      return;

    }

    /*
     * Abrir inmediatamente.
     */
setSelectedConversation(
  conversation
);

void ensurePushSubscription(
  companyId,
  currentUserId
).then(success => {

  console.log(
    "[Push] Registro al iniciar conversación:",
    success
  );

});

  } catch (error) {

    console.error(
      "No fue posible iniciar la conversación:",
      error
    );

    notify.error(
      error instanceof Error
        ? error.message
        : "No fue posible iniciar la conversación."
    );

  }

}

async function handleSelectConversation(
  conversation: ChatConversation
) {
  setSelectedConversation(
    conversation
  );

  if (!session) {
    return;
  }

  try {
    console.log(
      "[Push] Iniciando registro del dispositivo..."
    );

    const success =
      await ensurePushSubscription(
        session.company.id,
        session.user.id
      );

    console.log(
      "[Push] Resultado del registro:",
      success
    );
  } catch (error) {
    console.error(
      "[Push] Error no controlado:",
      error
    );
  }
}

  async function handleSendMessage(
    content: string
  ) {

    if (
      !session ||
      !selectedConversation
    ) {

      return;

    }

    setSending(true);

    try {

      const message =
        await sendMessage(

          selectedConversation.id,

          {
            companyId:
              session.company.id,

            userId:
              session.user.id,

            content,
          }

        );

      setMessages(
        current => [

          ...current,

          message,

        ]
      );

      const updated =
        await getConversations(

          session.company.id,

          session.user.id

        );

      setConversations(
        updated
      );

      const currentConversation =
        updated.find(
          conversation =>
            conversation.id ===
            selectedConversation.id
        );

      if (currentConversation) {

        setSelectedConversation(
          currentConversation
        );

      }

    } catch (error) {

      console.error(error);

      notify.error(
        error instanceof Error
          ? error.message
          : "No fue posible enviar el mensaje."
      );

    } finally {

      setSending(false);

    }

  }

  return (

    <div className="space-y-8">

      {/* Encabezado */}

      <div className="space-y-1">

        <div className="flex items-center gap-3">

          <MessagesSquare
            size={30}
            className="text-[#3C83F6]"
          />

          <h1 className="text-3xl font-bold text-[#333333] sm:text-4xl">

            Mensajes

          </h1>

        </div>

        <p className="text-slate-500">

          Comuníquese con otros usuarios de su empresa.

        </p>

      </div>

      <div
        className="
          grid
          gap-6
          xl:grid-cols-[320px_minmax(0,1fr)]
        "
      >

        <div className="space-y-6">

<ConversationList
  conversations={conversations}
  selectedConversationId={
    selectedConversation?.id
  }
  loading={loadingInitial}
  onSelect={
    handleSelectConversation
  }
/>

          <ChatUserList
            users={users}
            loading={
              loadingInitial
            }
            onSelect={
              handleStartConversation
            }
          />

        </div>

        <ChatWindow
          conversation={
            selectedConversation
          }
          messages={messages}
          currentUserId={
            session?.user.id ??
            0
          }
          loading={
            loadingMessages
          }
          sending={sending}
          onSend={
            handleSendMessage
          }
        />

      </div>

    </div>

  );

}