"use client";

import { useState, useEffect, useCallback } from "react";
import { Button, Transition } from "@mantine/core";

/**
 * Listens for the `beforeinstallprompt` browser event and renders an
 * "Install App" button when the PWA is installable. After a successful
 * install (or if the user dismisses the prompt) the button disappears.
 *
 * This component is client-only — it relies on browser APIs that do not
 * exist on the server.
 */

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
  prompt(): Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;

    const result = await deferredPrompt.prompt();

    if (result.outcome === "accepted") {
      setDeferredPrompt(null);
      setIsVisible(false);
    }
  }, [deferredPrompt]);

  return (
    <Transition mounted={isVisible} transition="slide-up" duration={400}>
      {(styles) => (
        <Button
          id="install-pwa-button"
          style={{
            ...styles,
            position: "fixed",
            bottom: "1.5rem",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
          }}
          size="lg"
          radius="xl"
          variant="gradient"
          gradient={{ from: "#1a1b4b", to: "#00d4aa", deg: 135 }}
          onClick={handleInstall}
        >
          📲 Install App
        </Button>
      )}
    </Transition>
  );
}
