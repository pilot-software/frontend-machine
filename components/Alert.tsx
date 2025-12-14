'use client';

import React, { useEffect, useState } from 'react';
import { X, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

export type AlertType = 'success' | 'error' | 'warning';

interface AlertProps {
  type: AlertType;
  message: string;
  duration?: number;
  onClose?: () => void;
}

const alertConfig = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: CheckCircle,
    iconColor: 'text-green-600',
    textColor: 'text-green-800',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: AlertCircle,
    iconColor: 'text-red-600',
    textColor: 'text-red-800',
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    icon: AlertTriangle,
    iconColor: 'text-yellow-600',
    textColor: 'text-yellow-800',
  },
};

export function Alert({ type, message, duration = 4000, onClose }: AlertProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const config = alertConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    if (isHovered) return;

    const timer = setTimeout(() => {
      setIsClosing(true);
      if (onClose) setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose, isHovered]);

  const handleClose = () => {
    setIsClosing(true);
    if (onClose) setTimeout(onClose, 300);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed top-4 left-4 right-4 md:left-auto md:right-4 z-[9999] transition-all duration-700 ${
        isClosing
          ? 'translate-x-full opacity-0'
          : 'translate-x-0 opacity-100 animate-bounce-in'
      }`}
      style={{
        animation: isClosing ? 'none' : 'bounceIn 0.5s ease-out',
      }}
    >
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${config.bg} ${config.border} shadow-lg`}
      >
        <Icon className={`h-5 w-5 flex-shrink-0 ${config.iconColor}`} />
        <p className={`text-sm font-medium ${config.textColor}`}>{message}</p>
        <button
          onClick={handleClose}
          className={`ml-2 flex-shrink-0 ${config.textColor} hover:opacity-70 transition-opacity`}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <style jsx>{`
        @keyframes bounceIn {
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
      `}</style>
    </div>
  );
}


