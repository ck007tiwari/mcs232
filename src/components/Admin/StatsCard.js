import React from "react";

const StatsCard = ({ icon: Icon, label, value, color }) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300",
    green: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300",
    purple: "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300",
    orange: "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300",
  };

  return (
    <div className="bg-white dark:bg-dark-secondary rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex items-center space-x-4">
      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}
      >
        <Icon size={24} />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
      </div>
    </div>
  );
};

export default StatsCard;
