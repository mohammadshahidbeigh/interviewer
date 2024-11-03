"use client";

import React from "react";

interface ErrorHandlerProps {
  message: string | null;
  type?: "error" | "info";
}

export const ErrorHandler: React.FC<ErrorHandlerProps> = ({
  message,
  type = "error",
}) => {
  if (!message) return null;

  const styles = {
    error: "bg-red-100 border-red-400 text-red-900",
    info: "bg-blue-100 border-l-4 border-blue-500 text-blue-700",
  };

  return (
    <div className="fixed top-4 right-4 max-w-md z-50 animate-fade-in">
      <div className={`${styles[type]} p-4 rounded shadow-lg`}>
        <div className="flex items-center">
          <div className="py-1">
            <svg
              className={`h-6 w-6 ${
                type === "error" ? "text-red-500" : "text-blue-500"
              } mr-4`}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div>{message}</div>
        </div>
      </div>
    </div>
  );
};
