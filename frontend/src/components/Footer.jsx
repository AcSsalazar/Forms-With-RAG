import React, { useEffect } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../stylesheets/home/style.css';

const FooterLink = ({ iconClass, text, href }) => (
  <li><i className={iconClass}></i> <a href={href}>{text}</a></li>
);

function Footer() {
  useEffect(() => {
    AOS.init();

    // Back to top button
    let backtotop = document.querySelector('.back-to-top');

    if (backtotop) {
      const toggleBacktotop = () => {
        if (window.scrollY > 100) {
          backtotop.classList.add('active');
        } else {
          backtotop.classList.remove('active');
        }
      }

      window.addEventListener('load', toggleBacktotop);
      window.addEventListener('scroll', toggleBacktotop);

      // Cleanup on component unmount
      return () => {
        window.removeEventListener('load', toggleBacktotop);
        window.removeEventListener('scroll', toggleBacktotop);
      };
    }
  }, []);

  const handleBackToTop = () => {
    // Scrolls to the top of the page
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <footer id="footer" data-aos="fade-up" data-aos-easing="ease-in-out" data-aos-duration="500">
        <div className="footer-newsletter">
          <div className="container">
            <div className="row">
              <div className="col-lg-6">
                <h4>Nuestro Newsletter</h4>
                <p>Suscríbete a nuestro Newsletter para obtener las actualizaciones de nuestras herramientas y ofertas exclusivas</p>
              </div>
              <div className="col-lg-6">
                <form action="" method="post">
                  <input type="email" name="email" /><input type="submit" value="Subscribe" />
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-top">
          <div className="container">
            <div className="row">

              <div className="col-lg-3 col-md-6 footer-links">
                <h4>Mapa del Sitio</h4>
                <ul>
                  <FooterLink iconClass="bx bx-chevron-right" text="Inicio" href="/" />
                  <FooterLink iconClass="bx bx-chevron-right" text="Acerca de nostros" href="https://wirkconsulting.com/#equipo" />
                  <FooterLink iconClass="bx bx-chevron-right" text="Servicios" href="https://wirkconsulting.com/#diagnosticos" />
                  <FooterLink iconClass="bx bx-chevron-right" text="Terminos de servico" href="https://wirkconsulting.com/" />
                  <FooterLink iconClass="bx bx-chevron-right" text="Políticas de privacidad" href="https://wirkconsulting.com/" />
                </ul>
              </div>

              <div className="col-lg-3 col-md-6 footer-links">
                <h4>Nuestras Herramientas</h4>
                <ul>
                  <FooterLink iconClass="bx bx-chevron-right" text="Autodiagnóstico" href="/autodiagnostico/" />
                  <FooterLink iconClass="bx bx-chevron-right" text="Marketplace" href="/marketplace/" />
                  <FooterLink iconClass="bx bx-chevron-right" text="Mentorías" href="/mentorias/" />
                  <FooterLink iconClass="bx bx-chevron-right" text="Cursos Virtuales" href="/academia/" />
                </ul>
              </div>

              <div className="col-lg-3 col-md-6 footer-contact">
                <h4>Conntáctanos</h4>
                <p>
                  Calle 22 #22-26<br />
                  Manizales, Caldas<br />
                  Colombia<br /><br />
                  <strong>Teléfono: </strong>(606) 8800609<br />
                  <strong>Email: </strong>gerencia@wirkconsulting.com<br />
                </p>
              </div>

              <div className="col-lg-3 col-md-6 footer-info">
                <h3>Acerca de Wirk Consulting SAS</h3>
                <p>
                  Somos una firma de consultoría que genera valor y confianza a sus clientes y aporta a las organizaciones conocimiento y experiencia para llevarte al siguiente nivel
                </p>
                <div className="social-links mt-3">
                  <a href="/" className="twitter"><i className="bx bxl-twitter"></i></a>
                  <a href="/" className="facebook"><i className="bx bxl-facebook"></i></a>
                  <a href="/" className="instagram"><i className="bx bxl-instagram"></i></a>
                  <a href="/" className="linkedin"><i className="bx bxl-linkedin"></i></a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="copyright">
            &copy; Copyright <strong><span>Wirk Consulting SAS</span></strong>. All Rights Reserved
          </div>
        </div>
      </footer>

      {/* Back to top button */}
      <a href="/" className="back-to-top d-flex align-items-center justify-content-center" onClick={handleBackToTop}>
        <i className="bi bi-arrow-up-short"></i>
      </a>
    </>
  );
}

export default Footer;