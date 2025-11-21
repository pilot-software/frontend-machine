'use client';

import React, { createContext, useContext, useState } from 'react';
import { Alert, AlertType } from './Alert';

interface AlertContextType {
  showAlert: (type: AlertType, message: string, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<
    Array<{ id: string; type: AlertType; message: string }>
  >([]);

  const showAlert = (type: AlertType, message: string, duration?: number) => {
    const id = Math.random().toString(36).substr(2, 9);
    setAlerts((prev) => [...prev, { id, type, message }]);
  };

  const removeAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  return (
    <AlertContext.Provider
      value={{
        showAlert,
        success: (msg, duration) => showAlert('success', msg, duration),
        error: (msg, duration) => showAlert('error', msg, duration),
        warning: (msg, duration) => showAlert('warning', msg, duration),
      }}
    >
      {children}
      <div className="fixed top-4 left-4 right-4 md:left-auto md:right-4 z-50 space-y-2">
        {alerts.map((alert) => (
          <Alert
            key={alert.id}
            type={alert.type}
            message={alert.message}
            onClose={() => removeAlert(alert.id)}
          />
        ))}
      </div>
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within AlertProvider');
  }
  return context;
}
