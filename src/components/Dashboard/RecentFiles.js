import React from 'react';
import { Link } from 'react-router-dom';
import { Book, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const RecentFiles = ({ files }) => {
  const sortedFiles = [...files].sort((a, b) => new Date(b.last_accessed) - new Date(a.last_accessed));
  const recentFiles = sortedFiles.slice(0, 5);

  return (
    <div className="bg-white dark:bg-dark-secondary rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {recentFiles.map((file) => (
          <Link
            key={file.id}
            to={`/pdf/${file.id}`}
            className="flex items-center space-x-4 p-3 -m-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-lg flex items-center justify-center">
              <Book size={20} />
            </div>
            <div className="flex-grow">
              <p className="font-medium text-gray-800 dark:text-gray-200 truncate">{file.subjectName} - {file.title}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <Clock size={12} className="mr-1.5" />
                Accessed {formatDistanceToNow(new Date(file.last_accessed), { addSuffix: true })}
              </p>
            </div>
            <div className="flex-shrink-0 text-right">
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{file.read_percentage}%</span>
                <p className="text-xs text-gray-500 dark:text-gray-400">Complete</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentFiles;
