"use client";

import React from "react";

interface ErrorHandlerProps {
  message: string;
}

export const ErrorHandler: React.FC<ErrorHandlerProps> = ({message}) => {
  return (
    <div className="bg-red-100 border border-red-400 text-red-900 px-4 py-3 rounded relative mb-4">
      <span className="block sm:inline">{message}</span>
    </div>
  );
};
