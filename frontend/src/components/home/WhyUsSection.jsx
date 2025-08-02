import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import WhyUs from '../../img/why-us.jpg';
import AOS from 'aos';
import 'aos/dist/aos.css';

const IconBox = ({ iconClass, title, linkTo, description }) => (
  <div className="icon-box">
    <div className="icon"><i className={`bx ${iconClass}`}></i></div>
    <h4 className="title">
      <a href={linkTo}>{title}</a>
    </h4>
    <p className="description">{description}</p>
  </div>
);

function WhyUsSection() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <section className="why-us section-bg" data-aos="fade-up" data-aos-delay="200">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 video-box">
            <img loading="lazy" src={WhyUs} className="img-fluid" alt="" />
            <Link to={'https://www.youtube.com/watch?v=jDDaplaOz7Q'} className="venobox play-btn mb-4" data-vbtype="video" data-autoplay="true"></Link>
          </div>
          <div className="col-lg-6 d-flex flex-column justify-content-center p-5">
            <IconBox
              iconClass="bx bx-fingerprint"
              title="Crecimiento empresarial"
              linkTo="/autodiagnostico/"
              description="En la era digital, el crecimiento empresarial y profesional se acelera a un ritmo sin precedentes. La tecnología ofrece una plataforma para la innovación continua y la adaptabilidad, permitiendo a las empresas y a los profesionales expandir sus horizontes y alcanzar nuevas alturas. Con las herramientas digitales adecuadas, la colaboración global y el aprendizaje constante se convierten en la norma, y las posibilidades de éxito son tan ilimitadas como nuestra capacidad para imaginar y ejecutar nuevas ideas."
            />
            <IconBox
              iconClass="bx bx-gift"
              title="Empieza tu prueba en nuestras herramientas"
              linkTo="/autodiagnostico/"
              description="Dale un impulso a tu trayectoria con solo un clic. Empieza tu prueba en nuestras herramientas y abre la puerta a un mundo de oportunidades digitales. Descubre cómo nuestra tecnología puntera puede transformar tu crecimiento empresarial y profesional hoy."
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyUsSection;