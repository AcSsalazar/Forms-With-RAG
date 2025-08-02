import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { resetPassword } from '../utils/apiServices';
import home from '../img/svg/home.svg';
import arrow from '../img/svg/arrow.svg';
import figure from '../img/svg/formulario_figure.svg';
import '../stylesheets/login.css';

function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const validatePasswords = () => {
    if (newPassword.length < 8) {
      setErrors('La contraseña debe tener al menos 8 caracteres.');
      return false;
    }
    if (newPassword !== confirmPassword) {
      setErrors('Las contraseñas no coinciden.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validatePasswords()) {
      setMessage('');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, newPassword);
      setMessage('Tu contraseña ha sido restablecida exitosamente. Puedes iniciar sesión con tu nueva contraseña.');
      setErrors('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        navigate('/login/');
      }, 3000);
    } catch (error) {
      setErrors(error.response?.data?.detail || 'Ocurrió un error. Por favor, intenta nuevamente.');
      setMessage('');
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
          <p className="notice__options--text">Restablecer Contraseña</p>
        </div>
        <div className="notice__title--container">
          <h4 className="notice__title">Restablece tu Contraseña</h4>
        </div>
      </div>

      <div className="document-check">
        <form onSubmit={handleSubmit} className="document-check-form">
          <label htmlFor="newPassword" className="form-label">Nueva Contraseña</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={newPassword}
            onChange={handleNewPasswordChange}
            required
            className="form-input"
            minLength="8"
          />

          <label htmlFor="confirmPassword" className="form-label">Confirmar Nueva Contraseña</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required
            className="form-input"
            minLength="8"
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
            {loading ? 'Restableciendo...' : 'Restablecer Contraseña'}
          </button>
          
          <Link to="/login/" className="form-submit-button" style={{ textAlign: 'center' }}>
            Volver a Iniciar Sesión
          </Link>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword; 