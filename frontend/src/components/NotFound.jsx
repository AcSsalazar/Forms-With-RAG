import React from 'react';
import { Link } from 'react-router-dom';
import '../stylesheets/notfound.css';

function NotFound() {
  return (
    <section className="not-found">
      <div className="not-found-container">
        {/* Círculo animado */}
        <div className="circle-bg"></div>

        {/* Texto 404 */}
        <h1 className="not-found-404">
          4<span><img src={require('../img/404-1.png')} alt="0" className='icon-web'/></span>4
        </h1>

        {/* Mensaje */}
        <div className="not-found-text">
          <h2>Ups!</h2>
          <p className='disclaimer'>Esta pagina no existe o no esta disponible</p>
          <div className="not-found-links">
            <Link to="/" className="btn-home">Home</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NotFound;
