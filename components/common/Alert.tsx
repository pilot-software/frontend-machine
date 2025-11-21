"use client";

import { useEffect, useState } from "react";
import { X, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

type AlertType = "success" | "warning" | "error";

interface AlertProps {
  type: AlertType;
  message: string;
  duration?: number;
  onClose?: () => void;
}

const alertConfig = {
  success: {
    icon: CheckCircle,
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    gradientOverlay: "from-green-500 to-green-600",
    iconColor: "text-green-600",
    textColor: "text-green-900",
  },
  warning: {
    icon: AlertTriangle,
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    gradientOverlay: "from-orange-500 to-orange-600",
    iconColor: "text-orange-600",
    textColor: "text-orange-900",
  },
  error: {
    icon: XCircle,
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    gradientOverlay: "from-red-500 to-red-600",
    iconColor: "text-red-600",
    textColor: "text-red-900",
  },
};

export function Alert({ type, message, duration = 5000, onClose }: AlertProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const config = alertConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    if (duration > 0 && !isHovered) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose, isHovered]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  return (
    <>
      <style>{`
        @keyframes bounceDown {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          50% {
            transform: translateY(10px);
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .alert-bounce {
          animation: bounceDown 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
      `}</style>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`alert-bounce flex items-center gap-6 px-8 py-5 rounded-xl border-2 shadow-lg ${config.bgColor} ${config.borderColor} max-w-md w-[90%]`}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${config.gradientOverlay} opacity-5 rounded-xl`} />
        <Icon className={`h-9 w-9 flex-shrink-0 ${config.iconColor} relative z-10`} strokeWidth={2} />
        <p className={`flex-1 text-lg font-bold ${config.textColor} relative z-10`}>
          {message}
        </p>
        <button
          onClick={handleClose}
          className={`flex-shrink-0 ${config.iconColor} hover:opacity-70 transition-opacity relative z-10`}
          aria-label="Close alert"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
    </>
  );
}
