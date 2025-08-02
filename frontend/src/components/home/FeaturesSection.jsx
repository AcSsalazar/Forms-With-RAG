import React, { useEffect } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../../stylesheets/home/style.css';

import FeaturesImage1 from '../../img/svg/features-1.svg';
import FeaturesImage2 from '../../img/svg/features-2.svg';
import FeaturesImage3 from '../../img/svg/features-3.svg';
import FeaturesImage4 from '../../img/svg/features-4.svg';

const Feature = ({ image, title, description, italicText, listItems }) => (
  <div className="row" data-aos="fade-up">
    <div className="col-md-5">
      <img loading="lazy" src={image} className="img-fluid" alt="" />
    </div>
    <div className="col-md-7 pt-4">
      <h3>{title}</h3>
      <p className="fst-italic">{italicText}</p>
      {description && <p>{description}</p>}
      {listItems && (
        <ul>
          {listItems.map((item, index) => (
            <li key={index}><i className="bi bi-check"></i> {item}</li>
          ))}
        </ul>
      )}
    </div>
  </div>
);

function FeaturesSection() {
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <section className="features">
      <div className="container">

        <div className="section-title">
          <h2>Conoce nuestras características</h2>
          <p>Descubre nuestro ecosistema de crecimiento: un Marketplace diverso, cursos enriquecedores, autodiagnósticos clarificadores y un sistema de mentorías personalizadas,
            todo diseñado para impulsar tu crecimiento empresarial y profesional en un solo lugar.</p>
        </div>

        <Feature
          image={FeaturesImage1}
          title="Sistema de Gestión de Aprendizaje"
          italicText="Descubre un camino de aprendizaje adaptado a tus necesidades con nuestro sistema de gestión. Avanza a tu propio ritmo y profundiza en las áreas que más te interesan."
          listItems={[
            "Cursos personalizados para una educación a medida.",
            "Seguimiento y evaluación continua para garantizar tu progreso."
          ]}
        />

        <Feature
          image={FeaturesImage2}
          title="Herramienta de Autodiagnóstico"
          italicText="Utiliza nuestra herramienta de autodiagnóstico para entender mejor las fortalezas y oportunidades de tu empresa en el mundo digital."
          description="Recibe recomendaciones prácticas para mejorar y digitalizar tus procesos de negocio, aumentando tu competitividad en el mercado."
        />

        <Feature
          image={FeaturesImage3}
          title="Marketplace"
          description="Explora nuestro Marketplace y conecta con una comunidad diversa de negocios y consumidores. Encuentra oportunidades únicas para crecer y expandir tu alcance."
          listItems={[
            "Amplia visibilidad para tus productos y servicios.",
            "Interacción directa con clientes y socios potenciales.",
            "Transacciones seguras y confiables."
          ]}
        />

        <Feature
          image={FeaturesImage4}
          title="Agendamiento de mentorías"
          italicText="Accede a nuestra plataforma de mentorías para recibir guía y asesoramiento de expertos. Fomenta tu desarrollo profesional con la experiencia y conocimiento de líderes en la industria."
          description="Planifica sesiones que se adapten a tus objetivos y necesidades, y da el próximo paso en tu carrera con confianza."
        />

      </div>
    </section>
  );
}

export default FeaturesSection;