import React from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, RadialLinearScale, PointElement, LineElement, Title, Filler, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, RadialLinearScale, PointElement, LineElement, Title, Filler, Tooltip, Legend);

function RadarChart({ categories }) {
  // Prepara los datos para el gráfico radar (Radar Chart)
  const getRadarChartData = (categories) => {
    return {
      data: {
        labels: categories.map(ca => ca.name),
        datasets: [
          {
            label: 'Puntaje Promedio',
            data: categories.map(ca => ca.average),
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            pointBackgroundColor: 'rgba(255, 99, 132, 1)',
          },
        ],
      },
      options: {
        scales: {
          r: {
            angleLines: {
              display: true,
            },
            suggestedMin: 0,
            suggestedMax: 5, // Asegurarse de que el máximo del eje R sea 5
            pointLabels: {
              display: false, // No mostrar los nombres de las categorías
              color: '#FFFFFF' // Color del texto en blanco
            },
            ticks: {
              display: false // No mostrar los valores numéricos
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
      },
    };
  };
  const chartData = getRadarChartData(categories);

  return <Radar data={chartData.data} options={chartData.options} />;
}

export default RadarChart;