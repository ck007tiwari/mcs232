import React from 'react';
import { 
  BookOpen, 
  MessageCircle, 
  CheckCircle, 
  Upload,
  Clock
} from 'lucide-react';

const RecentActivity = ({ activities }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'reading':
        return BookOpen;
      case 'question':
        return MessageCircle;
      case 'completion':
        return CheckCircle;
      case 'upload':
        return Upload;
      default:
        return Clock;
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'reading':
        return 'text-blue-600 bg-blue-100';
      case 'question':
        return 'text-green-600 bg-green-100';
      case 'completion':
        return 'text-purple-600 bg-purple-100';
      case 'upload':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = getIcon(activity.type);
            const iconColor = getIconColor(activity.type);
            
            return (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${iconColor}`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-600">{activity.subtitle}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            );
          })}
        </div>
        
        <button className="w-full mt-4 text-center text-sm text-primary-600 hover:text-primary-700 font-medium py-2">
          View all activity
        </button>
      </div>
    </div>
  );
};

export default RecentActivity;