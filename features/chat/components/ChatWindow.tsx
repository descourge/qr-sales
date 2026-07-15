"use client";

import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  MessageCircle,
  Send,
} from "lucide-react";

import {
  ChatConversation,
  ChatMessage,
} from "@/features/chat/types/chat";

type Props = {

  conversation:
    ChatConversation | null;

  messages:
    ChatMessage[];

  currentUserId: number;

  loading?: boolean;

  sending?: boolean;

  onSend: (
    content: string
  ) => Promise<void>;

};

export default function ChatWindow({

  conversation,

  messages,

  currentUserId,

  loading = false,

  sending = false,

  onSend,

}: Props) {

  const [
    content,
    setContent,
  ] =
    useState("");

  const messagesEndRef =
    useRef<HTMLDivElement | null>(
      null
    );

  useEffect(() => {

    messagesEndRef.current
      ?.scrollIntoView({
        behavior: "smooth",
      });

  }, [messages]);

  async function handleSubmit(
    event: FormEvent
  ) {

    event.preventDefault();

    const value =
      content.trim();

    if (
      !value ||
      sending
    ) {

      return;

    }

    await onSend(value);

    setContent("");

  }

  if (!conversation) {

    return (

      <div
        className="
          flex
          min-h-[520px]
          items-center
          justify-center
          rounded-2xl
          border
          border-gray-200
          bg-white
          p-8
          text-center
          shadow-sm
        "
      >

        <div className="max-w-sm">

          <MessageCircle
            size={46}
            className="mx-auto text-slate-300"
          />

          <h2 className="mt-4 text-xl font-semibold text-[#333333]">

            Selecciona una conversación

          </h2>

          <p className="mt-2 text-sm text-slate-500">

            Elige un usuario o una conversación para comenzar.

          </p>

        </div>

      </div>

    );

  }

  return (

    <div
      className="
        flex
        min-h-[520px]
        flex-col
        overflow-hidden
        rounded-2xl
        border
        border-gray-200
        bg-white
        shadow-sm
      "
    >

      {/* Encabezado */}

      <div
        className="
          shrink-0
          border-b
          border-gray-200
          px-5
          py-4
        "
      >

        <div className="flex items-center gap-3">

          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              bg-[#3C83F6]/10
              font-semibold
              text-[#3C83F6]
            "
          >

            {conversation.otherUser
              ?.name
              ?.charAt(0)
              .toUpperCase() ??
              "?"}

          </div>

          <div>

            <h2 className="font-semibold text-[#333333]">

              {conversation.otherUser
                ?.name ??
                "Usuario"}

            </h2>

            <p className="text-xs text-slate-500">

              {conversation.otherUser
                ?.branch
                ?.name ??
                conversation.otherUser
                  ?.role}

            </p>

          </div>

        </div>

      </div>

      {/* Mensajes */}

      <div
        className="
          flex-1
          space-y-3
          overflow-y-auto
          bg-slate-50
          p-4
          sm:p-5
        "
      >

        {loading ? (

          <div className="space-y-3">

            {[...Array(6)].map(
              (_, index) => (

                <div
                  key={index}
                  className={`
                    h-12
                    animate-pulse
                    rounded-2xl
                    bg-slate-200

                    ${
                      index % 2 === 0
                        ? "mr-16"
                        : "ml-16"
                    }
                  `}
                />

              )
            )}

          </div>

        ) : messages.length === 0 ? (

          <div
            className="
              flex
              h-full
              min-h-[320px]
              items-center
              justify-center
              text-center
            "
          >

            <p className="text-sm text-slate-500">

              Aún no hay mensajes. Escribe el primero.

            </p>

          </div>

        ) : (

          messages.map(message => {

            const own =
              message.senderId ===
              currentUserId;

            return (

              <div
                key={message.id}
                className={`
                  flex

                  ${
                    own
                      ? "justify-end"
                      : "justify-start"
                  }
                `}
              >

                <div
                  className={`
                    max-w-[82%]
                    rounded-2xl
                    px-4
                    py-2.5
                    shadow-sm

                    ${
                      own
                        ? `
                            rounded-br-md
                            bg-[#3C83F6]
                            text-white
                          `
                        : `
                            rounded-bl-md
                            border
                            border-gray-200
                            bg-white
                            text-[#333333]
                          `
                    }
                  `}
                >

                  <p className="whitespace-pre-wrap break-words text-sm">

                    {message.content}

                  </p>

                  <p
                    className={`
                      mt-1
                      text-right
                      text-[10px]

                      ${
                        own
                          ? "text-white/70"
                          : "text-slate-400"
                      }
                    `}
                  >

                    {new Date(
                      message.createdAt
                    ).toLocaleTimeString(
                      "es-CL",
                      {
                        hour:
                          "2-digit",
                        minute:
                          "2-digit",
                      }
                    )}

                  </p>

                </div>

              </div>

            );

          })

        )}

        <div ref={messagesEndRef} />

      </div>

      {/* Formulario */}

      <form
        onSubmit={handleSubmit}
        className="
          flex
          shrink-0
          items-end
          gap-3
          border-t
          border-gray-200
          bg-white
          p-4
        "
      >

        <textarea
          value={content}
          onChange={event =>
            setContent(
              event.target.value
            )
          }
          onKeyDown={event => {

            if (
              event.key ===
                "Enter" &&
              !event.shiftKey
            ) {

              event.preventDefault();

              event.currentTarget
                .form
                ?.requestSubmit();

            }

          }}
          maxLength={1000}
          rows={1}
          placeholder="Escribe un mensaje..."
          className="
            min-h-11
            max-h-32
            flex-1
            resize-none
            rounded-xl
            border
            border-gray-300
            px-4
            py-3
            outline-none
            transition
            focus:border-[#3C83F6]
            focus:ring-2
            focus:ring-[#3C83F6]/20
          "
        />

        <button
          type="submit"
          disabled={
            !content.trim() ||
            sending
          }
          className="
            inline-flex
            h-11
            shrink-0
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-[#3C83F6]
            px-4
            font-medium
            text-white
            transition-all
            hover:bg-[#2F6FD3]
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >

          <Send size={17} />

          <span className="hidden sm:inline">

            Enviar

          </span>

        </button>

      </form>

    </div>

  );

}