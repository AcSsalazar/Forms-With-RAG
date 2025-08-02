import React from 'react';
import { Link } from 'react-router-dom';
import { sliderSettings } from '../../utils/chartConfigs';
import BarChart from '../../charts/BarChart';
import RadarChart from '../../charts/RadarChart';
import PercentageChart from '../../charts/PercentageChart';
import '../../stylesheets/forms/form.css';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import home from '../../img/svg/home.svg';
import arrow from '../../img/svg/arrow.svg';
import figure from '../../img/svg/formulario_figure.svg';

const ResultsDisplay = ({ userData, categoryData }) => {
  // Mapeo para los gráficos y visualización
  const chartData = Array.isArray(categoryData)
    ? categoryData
        .filter(cat => cat && cat.category && typeof cat.category.name === 'string' && typeof cat.average === 'number')
        .map(cat => ({
          name: cat.category.name,
          average: cat.average, // Mantener 'average' para compatibilidad con PercentageChart
          value: cat.average,   // También incluir 'value' para otros componentes
          plan: cat.plan,
          ...cat.category
        }))
  
    : [];
   console.log('User Data:', userData)
   console.log('Category Data:', categoryData);
  return (
    <div className="results">
      <div className="notice__container">
        <div className="figure">
          <img src={figure} alt="figure" height={155} />
        </div>
        <div className="notice__options">
          <Link to={'/'}><img src={home} alt="home" /> </Link>
          <img src={arrow} alt="arrow" />
          <p className='notice__options--text'>Resultados</p>
        </div>
        <div className="notice__title--container">
          <h4 className='notice__title'>
            {`Bienvenido, ${userData?.info?.user_name || userData?.info?.full_name || userData?.info?.userName || 'Usuario'}! Estos son tus resultados de ${userData?.info?.analysisType}`}
          </h4>
        </div>
      </div>

      <section className="results-dashboard">
        <div className="slider-container">
          <Slider {...sliderSettings}>
            {chartData.map((category, index) => (
              <PercentageChart key={index} category={category} />
            ))}
          </Slider>
        </div>
        <div className="chart-container">
          <div className="chart">
            <BarChart categories={chartData} />
          </div>
          <div className="chart">
            <RadarChart categories={chartData} />
          </div>
        </div>
        <div className='restart-form'>
          <Link className='results-button restart' to='/autodiagnostico'>Rellenar otro formulario</Link>
        </div>
      </section>
    </div>
  );
};

export default ResultsDisplay;