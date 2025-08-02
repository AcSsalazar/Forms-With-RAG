import React, { useEffect, useContext } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from '../contexts/AuthContext'; // Importa AuthContext
import '../stylesheets/header.css';

function Header() {
  const { user, logout } = useContext(AuthContext); // Usa el contexto de autenticación
  const navigate = useNavigate();

  useEffect(() => {
    const navbar = document.getElementById('navbar');

    const handleMobileNavToggle = (e) => {
      navbar.classList.toggle('navbar-mobile');
      e.target.classList.toggle('bi-list');
      e.target.classList.toggle('bi-x');
    };

    const handleDropdownClick = (e) => {
      if (navbar.classList.contains('navbar-mobile')) {
        e.preventDefault();
        e.target.nextElementSibling?.classList.toggle('dropdown-active');
      }
    };

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

  const handleLogout = () => {
    logout();
    navigate('/user/');
  };

  return (
    <header className='header'>
      <div className='header__container'>
        <div className='header--logo'>
          <Link to='/'>
            <img className='header--image' src={require('../img/logo.jpg')} alt="Cámara de Comercio de Cali" />
          </Link>
        </div>
        <nav id="navbar" className="navbar">
          <ul>
            <li><Link className="active" to='/'>Home</Link></li>
            <li><Link to='/start-form/'>Test Online</Link></li>
            <li><Link to='/mentorias/'>Mentorias</Link></li>
            <li className="dropdown">
              {user ? (
                <>
                  <Link to='#'><span>{user.full_name}</span> <i className="bi bi-chevron-down"></i></Link>
                  <ul>
                    <li><Link to='/resultados/'>Resultados</Link></li>
                    <li><Link to='#' onClick={handleLogout}>Salir</Link></li>
                  </ul>
                </>
              ) : (
                <Link to='/login/'>Iniciar Sesión</Link>
              )}
            </li>
          </ul>
          <i className="bi bi-list mobile-nav-toggle"></i>
        </nav>
      </div>
    </header>
  );
}

export default Header;