import React, { useState } from "react";

const ChartTab: React.FC = () => {
  const [selected, setSelected] = useState<
    "optionOne" | "optionTwo" | "optionThree"
  >("optionOne");

  const getButtonClass = (option: "optionOne" | "optionTwo" | "optionThree") =>
    selected === option
      ? "shadow-theme-xs text-indigo-600 bg-white dark:bg-white border-2 border-indigo-600"
      : "text-gray-500 dark:text-gray-500 bg-white border border-gray-200";

  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-white p-0.5"></div>
  );
};

export default ChartTab;
