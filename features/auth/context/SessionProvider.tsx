"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  SessionData,
} from "../types";

type SessionContextType = {

  session: SessionData | null;

  loading: boolean;

  login: (
    session: SessionData
  ) => void;

  logout: () => void;

};

const SessionContext =
  createContext<
    SessionContextType | null
  >(null);

export default function SessionProvider({

  children,

}:{

  children: React.ReactNode;

}) {

  const [

    session,

    setSession,

  ] =
    useState<SessionData | null>(
      null
    );

  const [

    loading,

    setLoading,

  ] =
    useState(true);

  useEffect(() => {

    const saved =
      localStorage.getItem(
        "session"
      );

    if (saved) {

      setSession(
        JSON.parse(saved)
      );

    }

    setLoading(false);

  }, []);

  function login(

    data: SessionData

  ) {

    setSession(data);

    localStorage.setItem(

      "session",

      JSON.stringify(data)

    );

  }

  function logout() {

    localStorage.removeItem(
      "session"
    );

    setSession(null);

  }

  return (

    <SessionContext.Provider

      value={{

        session,

        loading,

        login,

        logout,

      }}

    >

      {children}

    </SessionContext.Provider>

  );

}

export function useSession() {

  const context =
    useContext(SessionContext);

  if (!context) {

    throw new Error(

      "useSession debe usarse dentro de SessionProvider."

    );

  }

  return context;

}