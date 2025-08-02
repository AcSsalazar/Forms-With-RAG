import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from '../utils/apiServices';
import home from '../img/svg/home.svg';
import arrow from '../img/svg/arrow.svg';
import figure from '../img/svg/formulario_figure.svg';
import '../stylesheets/login.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    // Limpiar errores cuando el usuario empiece a escribir
    if (errors) {
      setErrors('');
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Validar email
    if (!email) {
      setErrors('Por favor, ingresa tu correo electrónico.');
      return;
    }
    
    if (!validateEmail(email)) {
      setErrors('Por favor, ingresa un correo electrónico válido.');
      return;
    }

    setLoading(true);
    setErrors('');
    setMessage('');

    try {
      await sendPasswordResetEmail(email);
      setMessage('Si el correo está registrado, te enviaremos un enlace para restablecer tu contraseña.');
    } catch (error) {
      setErrors(error.response?.data?.detail || 'Ocurrió un error. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lineabase">
      <div className="notice__container">
        <div className="figure">
          <img src={figure} alt="figure" height={155} />
        </div>
        <div className="notice__options">
          <img src={home} alt="home" onClick={() => navigate('/')} />
          <img src={arrow} alt="arrow" />
          <p className="notice__options--text">Formulario de Recuperación de Contraseña</p>
        </div>
        <div className="notice__title--container">
          <h4 className="notice__title">Recupera tu Contraseña</h4>
        </div>
      </div>

      <div className="document-check">
        <form onSubmit={handleSubmit} className="document-check-form">
          <label htmlFor="email" className="form-label">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleEmailChange}
            required
            className="form-input"
            disabled={loading}
          />
          {errors && (
            <div className="error-container">
              <p className="error-message">{errors}</p>
            </div>
          )}
          {message && (
            <div className="success-container">
              <p className="success-message">{message}</p>
            </div>
          )}
          <button 
            type="submit" 
            className="form-submit-button"
            disabled={loading}
          >
            {loading ? 'Enviando...' : 'Enviar correo de recuperación'}
          </button>
          <Link to="/login/" className="form-submit-button" style={{ textAlign: 'center' }}>
            Volver a Iniciar Sesión
          </Link>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;