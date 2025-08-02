import React, { useEffect } from "react";
import { Link } from 'react-router-dom';

function Navbar() {

  useEffect(() => {
    /**
   * Mobile nav toggle
   */
    const navbar = document.getElementById('navbar');

    const handleMobileNavToggle = (e) => {
      navbar.classList.toggle('navbar-mobile');
      e.target.classList.toggle('bi-list');
      e.target.classList.toggle('bi-x');
    };

    /**
   * Mobile nav dropdowns activate
   */
    const handleDropdownClick = (e) => {
      if (navbar.classList.contains('navbar-mobile')) {
        e.preventDefault();
        e.target.nextElementSibling?.classList.toggle('dropdown-active'); // Added optional chaining
      }
    };

    /**
    * Scrool with ofset on links with a class name .scrollto
       */
    const handleScrollTo = (hash) => {
      const targetElement = document.querySelector(hash);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    };

    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    if (mobileNavToggle) {
      mobileNavToggle.addEventListener('click', handleMobileNavToggle);
    }

    const dropdownLinks = document.querySelectorAll('.navbar .dropdown > a');
    if (dropdownLinks) {
      dropdownLinks.forEach(item => {
        item.addEventListener('click', handleDropdownClick, true);
      });
    }

    const scrollToLinks = document.querySelectorAll('.scrollto');
    if (scrollToLinks) {
      scrollToLinks.forEach(item => {
        item.addEventListener('click', (e) => handleScrollTo(e.target.hash), true);
      });
    }

    return () => {
      if (mobileNavToggle) {
        mobileNavToggle.removeEventListener('click', handleMobileNavToggle);
      }
      if (dropdownLinks) {
        dropdownLinks.forEach(item => {
          item.removeEventListener('click', handleDropdownClick, true);
        });
      }
      if (scrollToLinks) {
        scrollToLinks.forEach(item => {
          item.removeEventListener('click', (e) => handleScrollTo(e.target.hash), true);
        });
      }
    };
  }, []);


  return (
    <nav id="navbar" className="navbar">
      <ul>
        <li><Link className="active" to='/'>Home</Link></li>
        <li className="dropdown"><Link to='#'><span>Herramienta de Autodiagnostico</span> <i className="bi bi-chevron-down"></i></Link>
          <ul>
            <li><Link to='/formulario'>Medianas y Grandes Empresas</Link></li>
            <li><Link to='/formulario'>Micros y Pequeñas Empresas</Link></li>
            <li><Link to='/formulario'>Economía Popular, Asociativa y Comunitaria</Link></li>
            <li><Link to='/formulario'>Excelencia Clínica</Link></li>
          </ul>
        </li>
        { /* 
        <li><Link to='/about'>Transformación Digital</Link></li>
        <li><Link to='/services'>Services</Link></li>
        <li><Link to='/portfolio'>Portfolio</Link></li>
        <li><Link to='/team'>Team</Link></li>
        <li><Link to='/blog'>Blog</Link></li>
        <li className="dropdown"><Link to='#'><span>Drop Down</span><i className="bi bi-chevron-down"></i></Link>
          <ul>
            <li><Link to='#'>Drop Down 1</Link></li>
            <li className="dropdown"><Link to='#'><span>Deep Drop Down</span><i className="bi bi-chevron-right"></i></Link>
              <ul>
                <li><Link to='#'>Deep Drop Down 1</Link></li>
                <li><Link to='#'>Deep Drop Down 2</Link></li>
                <li><Link to='#'>Deep Drop Down 3</Link></li>
                <li><Link to='#'>Deep Drop Down 4</Link></li>
                <li><Link to='#'>Deep Drop Down 5</Link></li>
              </ul>
            </li>
            <li><Link to='#'>Drop Down 2</Link></li>
            <li><Link to='#'>Drop Down 3</Link></li>
            <li><Link to='#'>Drop Down 4</Link></li>
          </ul>
        </li>
        <li><Link to='/contact'>Contact Us</Link></li>
        */ }
      </ul>
      <i className="bi bi-list mobile-nav-toggle"></i>
    </nav>
  );
}

export default Navbar;