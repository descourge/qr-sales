"use client";

import {
  MessageCircle,
  UserRound,
} from "lucide-react";

import {
  ChatUser,
} from "@/features/chat/types/chat";

type Props = {

  users: ChatUser[];

  loading?: boolean;

  onSelect: (
    user: ChatUser
  ) => void;

};

export default function ChatUserList({

  users,

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

          <MessageCircle
            size={21}
            className="text-[#3C83F6]"
          />

          <div>

            <h2 className="font-semibold text-[#333333]">

              Iniciar conversación

            </h2>

            <p className="text-sm text-slate-500">

              Usuarios de la empresa

            </p>

          </div>

        </div>

      </div>

      <div className="max-h-[360px] overflow-y-auto p-3">

        {loading ? (

          <div className="space-y-3">

            {[...Array(4)].map(
              (_, index) => (

                <div
                  key={index}
                  className="
                    h-16
                    animate-pulse
                    rounded-xl
                    bg-slate-100
                  "
                />

              )
            )}

          </div>

        ) : users.length === 0 ? (

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

            <UserRound
              size={34}
              className="text-slate-300"
            />

            <p className="text-sm text-slate-500">

              No hay otros usuarios disponibles.

            </p>

          </div>

        ) : (

          <div className="space-y-2">

            {users.map(user => (

              <button
                key={user.id}
                type="button"
                onClick={() =>
                  onSelect(user)
                }
                className="
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-xl
                  px-3
                  py-3
                  text-left
                  transition-colors
                  hover:bg-blue-50
                "
              >

                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-[#3C83F6]/10
                    font-semibold
                    text-[#3C83F6]
                  "
                >

                  {user.name
                    .charAt(0)
                    .toUpperCase()}

                </div>

                <div className="min-w-0 flex-1">

                  <p className="truncate font-medium text-[#333333]">

                    {user.name}

                  </p>

                  <p className="truncate text-xs text-slate-500">

                    {user.branch?.name ??
                      user.role}

                  </p>

                </div>

              </button>

            ))}

          </div>

        )}

      </div>

    </div>

  );

}