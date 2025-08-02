import React from 'react'
import { Link } from 'react-router-dom'
import '../stylesheets/notfound.css'

function NotFound() {
  return (
    <>
      <section className="not_found">
        <div className='not_found__image'>
          <img src={require('../img/404.png')} alt="404" width={650} />
        </div>
        <div className="not_found__text">
          <h1>Ooops... </h1>
          <h3>No se encontro la pagina solicitada.</h3>
          <p>Regresa a la pagina principal: <Link className='not_found__link' to='/'>Home</Link></p>
          <p>Regresa a nuestra herramienta de autodiagnóstico: <Link className='not_found__link' to='/autodiagnostico'>Autodiagnostico</Link></p>
        </div>
      </section>
    </>
  )
}

export default NotFound