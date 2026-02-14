import React from "react";
import { useTranslations } from "next-intl";
import { Loader } from "./loader";

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({
  message = "loading",
  className = "",
}: LoadingStateProps) {
  const t = useTranslations("common");
  
  const displayMessage = message.includes(' ') ? message : t(message);
  
  return (
    <div className={`py-8 ${className}`}>
      <Loader text={displayMessage} />
    </div>
  );
}
