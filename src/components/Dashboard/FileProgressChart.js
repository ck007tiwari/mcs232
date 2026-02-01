import React, { useContext } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import ThemeContext from '../../context/ThemeContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const FileProgressChart = ({ files }) => {
  const { theme } = useContext(ThemeContext);

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
        titleColor: theme === 'dark' ? 'black' : 'white',
        bodyColor: theme === 'dark' ? 'black' : 'white',
        callbacks: {
            label: function(context) {
                return `${context.raw}% Complete`;
            }
        }
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
            callback: function(value) {
                return value + '%'
            },
            color: theme === 'dark' ? '#e2e8f0' : '#4b5563',
        }
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
            color: theme === 'dark' ? '#e2e8f0' : '#4b5563',
        }
      },
    },
  };

  const data = {
    labels: files.map(file => {
      const label = `${file.subjectName} - ${file.title}`;
      return label.length > 30 ? label.substring(0, 27) + '...' : label;
    }),
    datasets: [
      {
        label: 'Read Percentage',
        data: files.map(file => file.read_percentage),
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white dark:bg-dark-secondary rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">File Progress Overview</h3>
      <div className="h-96">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default FileProgressChart;
