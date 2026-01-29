import React from "react";

const StatsCard = ({ icon: Icon, label, value, color }) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center space-x-4">
      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}
      >
        <Icon size={24} />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-600">{label}</p>
      </div>
    </div>
  );
};

export default StatsCard;
