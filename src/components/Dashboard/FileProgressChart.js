import React from 'react';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const FileProgressChart = ({ files }) => {
  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
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
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
            callback: function(value) {
                return value + '%'
            }
        }
      },
      y: {
        grid: {
          display: false,
        },
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">File Progress Overview</h3>
      <div className="h-96">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default FileProgressChart;
