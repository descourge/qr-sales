"use client";

import {
  MessageSquareText,
} from "lucide-react";

import {
  ChatConversation,
} from "@/features/chat/types/chat";

type Props = {

  conversations: ChatConversation[];

  selectedConversationId?: number;

  loading?: boolean;

  onSelect: (
    conversation: ChatConversation
  ) => void;

};

export default function ConversationList({

  conversations,

  selectedConversationId,

  loading = false,

  onSelect,

}: Props) {

  return (

    <div
      className="
        rounded-2xl
        border
        border-gray-200
        bg-white
        shadow-sm
      "
    >

      <div
        className="
          border-b
          border-gray-200
          px-5
          py-4
        "
      >

        <div className="flex items-center gap-3">

          <MessageSquareText
            size={21}
            className="text-[#3C83F6]"
          />

          <div>

            <h2 className="font-semibold text-[#333333]">

              Conversaciones

            </h2>

            <p className="text-sm text-slate-500">

              Mensajes recientes

            </p>

          </div>

        </div>

      </div>

      <div className="max-h-[420px] overflow-y-auto p-3">

        {loading ? (

          <div className="space-y-3">

            {[...Array(5)].map(
              (_, index) => (

                <div
                  key={index}
                  className="
                    h-20
                    animate-pulse
                    rounded-xl
                    bg-slate-100
                  "
                />

              )
            )}

          </div>

        ) : conversations.length === 0 ? (

          <div
            className="
              flex
              flex-col
              items-center
              justify-center
              gap-2
              px-4
              py-10
              text-center
            "
          >

            <MessageSquareText
              size={34}
              className="text-slate-300"
            />

            <p className="text-sm text-slate-500">

              Aún no tienes conversaciones.

            </p>

          </div>

        ) : (

          <div className="space-y-2">

            {conversations.map(
              conversation => {

                const selected =
                  selectedConversationId ===
                  conversation.id;

                return (

                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() =>
                      onSelect(
                        conversation
                      )
                    }
                    className={`
                      flex
                      w-full
                      items-start
                      gap-3
                      rounded-xl
                      px-3
                      py-3
                      text-left
                      transition-all

                      ${
                        selected
                          ? `
                              bg-[#3C83F6]
                              text-white
                              shadow-sm
                            `
                          : `
                              hover:bg-blue-50
                            `
                      }
                    `}
                  >

                    <div
                      className={`
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        font-semibold

                        ${
                          selected
                            ? `
                                bg-white/20
                                text-white
                              `
                            : `
                                bg-[#3C83F6]/10
                                text-[#3C83F6]
                              `
                        }
                      `}
                    >

                      {conversation.otherUser
                        ?.name
                        ?.charAt(0)
                        .toUpperCase() ??
                        "?"}

                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="flex items-center justify-between gap-3">

                        <p className="truncate font-medium">

                          {conversation.otherUser
                            ?.name ??
                            "Usuario"}

                        </p>

                        {conversation.lastMessage && (

                          <span
                            className={`
                              shrink-0
                              text-[11px]

                              ${
                                selected
                                  ? "text-white/70"
                                  : "text-slate-400"
                              }
                            `}
                          >

                            {new Date(
                              conversation
                                .lastMessage
                                .createdAt
                            ).toLocaleTimeString(
                              "es-CL",
                              {
                                hour: "2-digit",
                                minute:
                                  "2-digit",
                              }
                            )}

                          </span>

                        )}

                      </div>

                      <p
                        className={`
                          mt-1
                          truncate
                          text-sm

                          ${
                            selected
                              ? "text-white/80"
                              : "text-slate-500"
                          }
                        `}
                      >

                        {conversation.lastMessage
                          ?.content ??
                          "Sin mensajes"}

                      </p>

                    </div>

                  </button>

                );

              }
            )}

          </div>

        )}

      </div>

    </div>

  );

}