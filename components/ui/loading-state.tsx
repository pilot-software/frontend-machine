import React from "react";
import { useTranslations } from "next-intl";

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({
  message = "loading",
  className = "",
}: LoadingStateProps) {
  const t = useTranslations("common");
  
  // Try to translate, fallback to raw message if translation doesn't exist
  const displayMessage = message.includes(' ') ? message : t(message);
  
  return (
    <div className={`flex items-center justify-center py-8 ${className}`}>
      <div className="text-sm text-muted-foreground">{displayMessage}</div>
    </div>
  );
}
