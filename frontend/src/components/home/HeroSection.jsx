import React from "react";
import { Link } from 'react-router-dom';
import '../../stylesheets/home/style.css';

const CarouselItem = ({ title, description, linkText, isFirst }) => (
  // Se aplica la condicion de active si es el primer elemento
  <div className={`carousel-item ${isFirst ? 'active' : ''}`}>
    <div className="carousel-container">
      <h2 className="animate__animated animate__fadeInDown">{title}</h2>
      <p className="animate__animated animate__fadeInUp">{description}</p>
      <Link to='' className="btn-get-started animate__animated animate__fadeInUp">{linkText}</Link>
    </div>
  </div>
);

function HeroSection() {
  return (
    <>
      <section id="hero" className="d-flex justify-content-center align-items-center">
        <div id="heroCarousel" className="container carousel carousel-fade" data-bs-ride="carousel" data-bs-interval="5000">

          <CarouselItem
            title="Bienvenidos a Wirk Tools"
            description="Estamos emocionados de darles la bienvenida a este espacio dedicado a impulsar y destacar sus empresas. Aquí, podrán mostrar al mundo lo mejor de sus servicios y productos, conectándose con aquellos que buscan exactamente lo que ustedes ofrecen."
            linkTo="https://wirkconsulting.com/"
            linkText="Aprende más"
            isFirst={true}
          />

          <CarouselItem
            title="Herramienta de Autodiagnóstico"
            description="Bienvenidos a nuestra herramienta de autodiagnóstico del nivel de madurez en la transformación digital desarrollada por la Cámara de Comercio de Cali y Wirk Consulting SAS. Esta herramienta está diseñada para ayudar a las empresas a evaluar su nivel de madurez digital en diferentes áreas clave, y proporcionar recomendaciones para mejorar su capacidad de transformación digital."
            linkTo="/autodiagnostico/"
            linkText="Aprende más"
          />

          <CarouselItem
            title="Marketplace"
            description="En nuestro Marketplace, damos la bienvenida a empresas de todos los sectores y tamaños. Creemos en la diversidad y la riqueza que aporta la variedad de servicios y productos. Ya seas una pequeña empresa local, una start-up innovadora o una empresa consolidada, este es el lugar para ti."
            linkTo="/marketplace/"
            linkText="Aprende más"
          />

          <a className="carousel-control-prev" href="#heroCarousel" role="button" data-bs-slide="prev">
            <span className="carousel-control-prev-icon bx bx-chevron-left" aria-hidden="true"></span>
          </a>

          <a className="carousel-control-next" href="#heroCarousel" role="button" data-bs-slide="next">
            <span className="carousel-control-next-icon bx bx-chevron-right" aria-hidden="true"></span>
          </a>
        </div>
      </section>
    </>
  );
}

export default HeroSection;