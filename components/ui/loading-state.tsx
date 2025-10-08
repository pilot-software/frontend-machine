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
  return (
    <div className={`flex items-center justify-center py-8 ${className}`}>
      <div className="text-sm text-muted-foreground">{t(message)}</div>
    </div>
  );
}
