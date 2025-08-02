import React from "react";
import { Link } from 'react-router-dom'
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';


const ServiceItem = ({ iconColor, iconClass, title, linkTo, description, delay }) => (
  <div className="col-md-6 col-lg-3 d-flex align-items-stretch" data-aos="fade-up" data-aos-delay={delay}>
    <div className={`icon-box ${iconColor}`}>
      <div className="icon"><i className={`bx ${iconClass}`}></i></div>
      <h4 className="title"><Link to={linkTo}>{title}</Link></h4>
      <p className="description">{description}</p>
    </div>
  </div>
);

function ServicesSection() {

  //effect AOS en el componente
  useEffect(() => {
    AOS.init();
  }, [])

  return (
    <section className="services">
      <div className="container">

        <div className="row">
          <ServiceItem
            iconColor="icon-box-pink"
            iconClass="bx bxl-dribbble"
            linkTo="/marketplace/"
            title="Marketplace"
            description="Explora nuestro Mercado, un espacio vibrante donde puedes descubrir una amplia variedad de productos y servicios diseñados para enriquecer tu experiencia. Aquí, la calidad se encuentra con la conveniencia en una plataforma que celebra la diversidad y la innovación."
          />

          <ServiceItem
            iconColor="icon-box-cyan"
            iconClass="bx bx-file"
            linkTo="/academia/"
            title="Nuestros Cursos"
            description="Sumérgete en el aprendizaje con nuestra ección de cursos. Cada uno está diseñado para impulsarte hacia adelante en tu viaje educativo, ofreciendo conocimientos profundos y habilidades prácticas en una variedad de temas y disciplinas."
            delay={100}
          />

          <ServiceItem
            iconColor="icon-box-green"
            iconClass="bx bx-tachometer"
            linkTo="/autodiagnostico/"
            title="Autodiagnostico"
            description="Nuestra herramienta de Autodiagnóstico está diseñada para proporcionarte una evaluación rápida y personalizada. Descubre puntos fuertes, áreas para mejorar y recibe recomendaciones personalizadas para tu empresa."
            delay={200}
          />

          <ServiceItem
            iconColor="icon-box-blue"
            iconClass="bx bx-world"
            linkTo="/mentorias/"
            title="Mentorias"
            description="Con nuestro sistema de agendamiento de mentorías, te conectamos con líderes y profesionales de la industria para sesiones personalizadas. Es la oportunidad perfecta para recibir orientación, resolver dudas y planificar tu camino al éxito con el apoyo de expertos."
            delay={200}
          />

        </div>
      </div>
    </section>
  );
}

export default ServicesSection;