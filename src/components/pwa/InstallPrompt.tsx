"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect iOS Safari
    const isIosDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(window as unknown as { MSStream: boolean }).MSStream;
    // eslint-disable-next-line
    setIsIOS(isIosDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show the prompt if not already installed
      if (!window.matchMedia("(display-mode: standalone)").matches) {
        setShowPrompt(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // If iOS and not installed, optionally show prompt to teach them how to install
    if (isIosDevice && !window.matchMedia("(display-mode: standalone)").matches) {
      // setShowPrompt(true); // Uncomment to aggressively show iOS prompt
    }

    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  return (
    <Dialog open={showPrompt} onOpenChange={setShowPrompt}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Install NITRR OSS App</DialogTitle>
          <DialogDescription>
            Install our app on your device for a faster, better experience with offline access and
            push notifications.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setShowPrompt(false)}>
            Maybe Later
          </Button>
          {isIOS ? (
            <div className="text-sm text-muted-foreground p-2 text-center bg-muted rounded-md w-full mt-2">
              To install, tap the Share icon at the bottom of your screen and select{" "}
              <strong>Add to Home Screen</strong>.
            </div>
          ) : (
            <Button onClick={handleInstallClick}>Install App</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
