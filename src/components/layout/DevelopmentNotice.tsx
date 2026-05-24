"use client";

import { AlertTriangle, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export function DevelopmentNotice() {
  const [showNotice, setShowNotice] = useState<boolean | null>(null);

  useEffect(() => {
    const isDismissed = localStorage.getItem("development-notice-dismissed");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShowNotice(!isDismissed);
  }, []);

  const handleDismiss = useCallback(() => {
    setShowNotice(false);
    localStorage.setItem("development-notice-dismissed", "true");
  }, []);

  // Don't render until we've checked localStorage
  if (showNotice === null) return null;
  if (!showNotice) return null;

  return (
    <div className="fixed top-20 left-0 right-0 z-50 px-4 py-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative border border-amber-500 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-700 rounded-lg p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900 dark:text-amber-100">
                Website Under Development
              </h3>
              <p className="text-sm text-amber-800 dark:text-amber-200 mt-1">
                This website is still in active development. Some information may be incomplete or
                inaccurate. We&apos;re working to have everything ready soon. Thank you for your
                patience!
              </p>
            </div>
            <button
              onClick={handleDismiss}
              className="shrink-0 text-amber-600 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-200 transition-colors"
              aria-label="Dismiss notice"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
