import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, RadialLinearScale, PointElement, LineElement, Title, Filler, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, RadialLinearScale, PointElement, LineElement, Title, Filler, Tooltip, Legend);

function BarChart({ categories }) {
  // Prepara los datos para el gráfico de barras (Bar Chart)
  const getBarChartData = (categories) => {
    return {
      labels: categories.map(ca => ca.name),
      datasets: [
        {
          label: 'Puntaje Promedio',
          data: categories.map(ca => ca.average),
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  const chartData = getBarChartData(categories);

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        max: 5, // Asegurarse de que el máximo del eje Y sea 5
        ticks: {
          color: '#FFFFFF' // Color del texto en blanco
        }
      },
      x: {
        ticks: {
          color: '#FFFFFF' // Color del texto en blanco
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: '#FFFFFF' // Color del texto en blanco
        }
      }
    }
  };

  return <Bar data={chartData} options={options} />;
}

export default BarChart;