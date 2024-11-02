"use client";

import React from "react";

interface ErrorHandlerProps {
  message: string;
}

export const ErrorHandler: React.FC<ErrorHandlerProps> = ({message}) => {
  return (
    <div
      style={{
        padding: "1rem",
        margin: "1rem 0",
        backgroundColor: "#fee2e2",
        border: "1px solid #ef4444",
        borderRadius: "0.375rem",
        color: "#991b1b",
      }}
    >
      <p style={{margin: 0}}>{message}</p>
    </div>
  );
};
