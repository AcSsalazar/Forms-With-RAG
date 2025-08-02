import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, loginUser } from '../utils/apiServices';
import { AuthContext } from '../contexts/AuthContext';
import home from '../img/svg/home.svg';
import arrow from '../img/svg/arrow.svg';
import figure from '../img/svg/formulario_figure.svg';
import thankYouImage from '../img/grow-you-business.png';
import '../stylesheets/login.css';

function AuthForm() {
  const [document, setDocument] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [errors, setErrors] = useState({});
  const { user, login, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleDocumentChange = (event) => {
    setDocument(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleFullNameChange = (event) => {
    setFullName(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isRegister) {
      handleRegister();
    } else {
      handleLogin();
    }
  };

  const handleLogin = async () => {
    try {
      const data = await loginUser(document, password);
      await login(data.access);
      setErrors({});
    } catch (error) {
      setErrors({ detail: error.response.data.detail });
    }
  };

  const handleRegister = async () => {
    try {
      await registerUser(document, email, fullName, password);
      handleLogin();
    } catch (error) {
      setErrors({ detail: error.response.data.detail });
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (user) {
    return (
      <section className="thank_you">
        <div className='thank_you__image'>
          <img src={thankYouImage} alt="Thank You"/>
        </div>
        <div className="thank_you__text">
          <h1>Bienvido a la herramienta de transformación digital desarrollada por Wirk Consulting, {user?.full_name || 'Usuario'}!</h1>
          <h3>Es para nosotros un gusto poder ayudarte en tu crecimiento empresarial.</h3>
          <p>Dale un impulso a tu trayectoria con solo un clic. Empieza tu prueba en nuestras herramientas y abre la puerta a un mundo de oportunidades digitales.</p>
          <p>Regresa a la página principal: <Link className='thank_you__link' to='/'>Home</Link></p>
          <p>Herramienta de autodiagnóstico: <Link className='thank_you__link' to='/autodiagnostico'>Autodiagnóstico</Link></p>
          <p>Conoce nuestro Marketplace: 
            <a className='thank_you__link' href='https://marketplace.transformaciondigital.com.co/' target='_blank' rel='noopener noreferrer'>
              Marketplace
            </a>
          </p>
          <p>Agenda ya tu mentoria: <Link className='thank_you__link' to='/mentorias/'>Agenda</Link></p>
        </div>
      </section>
    );
  }

  return (
    <div className="lineabase">
      <div className="notice__container">
        <div className="figure">
          <img src={figure} alt="figure" height={155} />
        </div>
        <div className="notice__options">
          <img src={home} alt="home" onClick={() => navigate('/')} />
          <img src={arrow} alt="arrow" />
          <p className='notice__options--text'>{isRegister ? 'Formulario de Registro' : (user ? 'Bienvenido' : 'Formulario de Inicio de Sesión')}</p>
        </div>
        <div className="notice__title--container">
          <h4 className='notice__title'>{user ? `Bienvenido, ${user.full_name}` : (isRegister ? 'Registrar una nueva cuenta' : 'Inicia sesión en tu cuenta')}</h4>
        </div>
      </div>

      {!user && (
        <div className="document-check">
          <form onSubmit={handleSubmit} className="document-check-form">
            <label htmlFor="document" className="form-label">Documento de identidad</label>
            <input
              type="text"
              id="document"
              name="document"
              value={document}
              onChange={handleDocumentChange}
              required
              className="form-input"
            />
            {isRegister && (
              <>
                <label htmlFor="email" className="form-label">Correo Electrónico</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                  className="form-input"
                />
                <label htmlFor="fullName" className="form-label">Nombre Completo</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={fullName}
                  onChange={handleFullNameChange}
                  required
                  className="form-input"
                />
              </>
            )}
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              required
              className="form-input"
            />
            {errors.detail && (
              <div className="error-container">
                <p className="error-message">{errors.detail}</p>
              </div>
            )}
            <button type="submit" className="form-submit-button">{isRegister ? 'Registrar' : 'Iniciar Sesión'}</button>
            {!user && (
              <button onClick={() => setIsRegister(!isRegister)} className="form-submit-button">
                {isRegister ? '¿Ya tienes una cuenta? Inicia sesión' : '¿No tienes una cuenta? Regístrate'}
              </button>
            )}
            {!isRegister && (
              <Link to="/forgot-password/" className="forgot-password-link">¿Olvidaste tu contraseña?</Link>
            )}
          </form>
        </div>
      )}
    </div>
  );
}

export default AuthForm;