import React from 'react';
import { Bubble } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, RadialLinearScale, PointElement, LineElement, Title, Filler, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, RadialLinearScale, PointElement, LineElement, Title, Filler, Tooltip, Legend);

const BubbleChart = ({ intensidadDigital, gestionTransformacional }) => {
  // Prepara los datos para el gráfico cartesiano (Bubble Chart)
  const getBubbleChartData = (intensidadDigital, gestionTransformacional) => {
    return {
      datasets: [{
        label: ['Intensidad'],
        data: [{
          x: intensidadDigital,
          y: gestionTransformacional,
          r: 10, // Tamaño de la burbuja
        }],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
      }],
    };
  };

  const chartData = getBubbleChartData(intensidadDigital, gestionTransformacional);

  const optionsForBubbleChart = {
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        max: 5, // Asegurarse de que el máximo del eje Y sea 5
        title: {
          display: true,
          text: 'Intensidad en la Gestión Transformacional',
          color: '#FAFAFA',
        },
        ticks: {
          color: '#FAFAFA', // Color del texto en blanco
        },
      },
      x: {
        beginAtZero: true,
        min: 0,
        max: 5, // Asegurarse de que el máximo del eje X sea 5
        title: {
          display: true,
          text: 'Intensidad Digital',
          color: '#FAFAFA',
        },
        ticks: {
          color: '#FAFAFA', // Color del texto en blanco
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: '#FAFAFA', // Color del texto en blanco
        },
      },
    },
  };

  return <Bubble data={chartData} options={optionsForBubbleChart} />;
};

export default BubbleChart;