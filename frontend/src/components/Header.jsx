import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../stylesheets/header.css';
import logoImg from '../img/svg/logo-header.svg';
import { SignedIn, SignedOut, UserButton, SignInButton, SignOutButton, useUser } from '@clerk/clerk-react';

function Header() {
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();
  const { user } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Evitar scroll cuando el menú móvil está abierto
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <header className="header">
      <div className="header__container">
        
        {/* Marca */}
        <Link to="/" className="header__brand" onClick={closeMobileMenu}>
          <img className="header__logo" src={logoImg} alt="logo" />
          <h3 className="header__text">Rag Forms</h3>
        </Link>

        {/* Botón menú móvil */}
        <button
          type="button"
          className="mobile-nav-toggle"
          aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <i className={`bi ${mobileOpen ? 'bi-x' : 'bi-list'}`} />
        </button>

        {/* Navegación */}
        <nav className={`navbar ${mobileOpen ? 'navbar--open' : ''}`}>
          <ul className="navbar__list">

              {/* Usuario no logeado */}
             <li className="navbar__item">
            <SignedOut>
              
                <span className="navbar__welcome">Welcome! 👋</span>
                <SignInButton mode="modal">
                  <button className="navbar__link" onClick={closeMobileMenu}>Iniciar sesión</button>
                </SignInButton>
              
            </SignedOut>
            </li>

            {/* Usuario logeado */}
            <li className="navbar__item user-section">
            <SignedIn>
              
                <span className="navbar__welcome">Hi, {user?.firstName || 'User'} 👋</span>
                <UserButton />
                <SignOutButton>
                  <button className="navbar__link" onClick={closeMobileMenu}>Cerrar sesión</button>
                </SignOutButton>
              
            </SignedIn>
            </li>
            <li><Link to="/" className="navbar__link" onClick={closeMobileMenu}>Home</Link></li>
            <li><Link to="/start-form/" className="navbar__link" onClick={closeMobileMenu}>Test Online</Link></li>
            <li><Link to="/catalog/" className="navbar__link" onClick={closeMobileMenu}>Catálogo</Link></li>




          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
