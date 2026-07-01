"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
  }>;
};

type InstallContextType = {
  canInstall: boolean;
  install: () => Promise<void>;
};

const InstallContext =
  createContext<InstallContextType>({
    canInstall: false,
    install: async () => {},
  });

export function InstallPWAProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [prompt, setPrompt] =
    useState<BeforeInstallPromptEvent | null>(
      null
    );

  useEffect(() => {
    function handleBeforeInstallPrompt(
      event: Event
    ) {
      event.preventDefault();

      setPrompt(
        event as BeforeInstallPromptEvent
      );
    }

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt
    );

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  async function install() {
    if (!prompt) return;

    await prompt.prompt();

    await prompt.userChoice;

    setPrompt(null);
  }

  return (
    <InstallContext.Provider
      value={{
        canInstall: !!prompt,
        install,
      }}
    >
      {children}
    </InstallContext.Provider>
  );
}

export function useInstallPWA() {
  return useContext(InstallContext);
}