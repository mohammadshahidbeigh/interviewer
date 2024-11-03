"use client";

import {FC} from "react";

interface QuestionDisplayProps {
  question: string;
}

const QuestionDisplay: FC<QuestionDisplayProps> = ({question}) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-semibold mb-2">Current Question:</h3>
      <p className="text-gray-700 dark:text-gray-300 text-lg">{question}</p>
    </div>
  );
};

export default QuestionDisplay;
