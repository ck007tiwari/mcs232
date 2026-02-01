import React, { useContext } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import ThemeContext from '../../context/ThemeContext';

ChartJS.register(ArcElement, Tooltip, Legend);

const SubjectProgress = ({ data }) => {
  const { theme } = useContext(ThemeContext);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          color: theme === 'dark' ? '#e2e8f0' : '#4b5563',
        },
      },
      tooltip: {
        backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
        titleColor: theme === 'dark' ? 'black' : 'white',
        bodyColor: theme === 'dark' ? 'black' : 'white',
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += `${context.parsed.toFixed(2)} hours`;
            }
            return label;
          }
        }
      },
    },
    cutout: '60%',
  };

  return (
    <div className="bg-white dark:bg-dark-secondary rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Subject Breakdown (by hours)</h3>
      <div className="h-64">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default SubjectProgress;