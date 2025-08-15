import React, { useEffect } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../stylesheets/footer.css';
import { Link } from 'react-router-dom';

const FooterLink = ({ text, href, external }) => (
  <li>
    {external ? (
      <a href={href} target="_blank" rel="noopener noreferrer">{text}</a>
    ) : (
      <Link to={href}>{text}</Link>
    )}
  </li>
);

function Footer() {
  useEffect(() => {
    AOS.init({ duration: 500, easing: 'ease-in-out', once: true });

    const backtotop = document.querySelector('.back-to-top');
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop?.classList.add('active');
      } else {
        backtotop?.classList.remove('active');
      }
    };

    window.addEventListener('scroll', toggleBacktotop);
    toggleBacktotop(); // Initial check

    return () => {
      window.removeEventListener('scroll', toggleBacktotop);
    };
  }, []);

  const handleBackToTop = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="footer" data-aos="fade-up">
      <div className="footer-container">
        <div className="footer-section about">
          <h4 className="footer-title">Open Source Project</h4>
          <p>
            An open-source platform to enhance user feedback through dynamic forms.
          </p>
          <div className="social-links">
            <a href="https://twitter.com/acsalazar" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="bx bxl-twitter"></i>
            </a>
            <a href="https://facebook.com/acsalazar" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="bx bxl-facebook"></i>
            </a>
            <a href="https://instagram.com/acsalazar" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="bx bxl-instagram"></i>
            </a>
            <a href="https://linkedin.com/in/acsalazar" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="bx bxl-linkedin"></i>
            </a>
          </div>
        </div>

        <div className="footer-section links">
          <h4 className="footer-title">Useful Links</h4>
          <ul>
            <FooterLink text="RAG Systems" href="/rag-systems" external={false} />
            <FooterLink text="Pinecone Documentation" href="/pinecone" external={false} />
            <FooterLink text="What is Langchain" href="/langchain" external={false} />
            <FooterLink text="My Portfolio" href="https://acsalazar.com" external={true} />
          </ul>
        </div>

        <div className="footer-section contact">
          <h4 className="footer-title">Contact</h4>
          <p>Medellín, Colombia</p>
          <p>Email: <a href="mailto:acsalazar-19@hotmail.com">acsalazar-19@hotmail.com</a></p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 Open Source Project. All Rights Reserved.</p>
      </div>

      <button className="back-to-top" onClick={handleBackToTop} title="Back to Top">
        <i className="bi bi-arrow-up-short"></i>
      </button>
    </footer>
  );
}

export default Footer;