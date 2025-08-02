import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../utils/apiServices';
import { AuthContext } from '../contexts/AuthContext';
import home from '../img/svg/home.svg';
import arrow from '../img/svg/arrow.svg';
import figure from '../img/svg/formulario_figure.svg';
import '../stylesheets/login.css';

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState('');
  const { user, loading, updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login/');
    }
  }, [loading, user, navigate]);

  const handleCurrentPasswordChange = (event) => {
    setCurrentPassword(event.target.value);
  };

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleConfirmNewPasswordChange = (event) => {
    setConfirmNewPassword(event.target.value);
  };

  const validatePasswords = () => {
    if (newPassword !== confirmNewPassword) {
      setErrors('Las contraseñas nuevas no coinciden.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validar si las contraseñas coinciden antes de enviar el formulario
    if (!validatePasswords()) {
      setMessage('');
      return;
    }

    try {
      // Cambiar la contraseña llamando a la API
      await changePassword(user.token, currentPassword, newPassword); // Uso del token del usuario
      setMessage('Tu contraseña ha sido cambiada exitosamente.');
      setErrors('');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      
      // Actualizar el perfil del usuario si es necesario
      updateProfile({ ...user, password: newPassword });
    } catch (error) {
      setErrors('Hubo un error al cambiar la contraseña. Inténtalo de nuevo.');
      setMessage('');
    }
  };

  if (loading || !user) {
    return <p>Cargando...</p>;
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
          <p className="notice__options--text">Formulario de Cambio de Contraseña</p>
        </div>
        <div className="notice__title--container">
          <h4 className="notice__title">Cambia tu Contraseña</h4>
        </div>
      </div>

      <div className="document-check">
        <form onSubmit={handleSubmit} className="document-check-form">
          <label htmlFor="currentPassword" className="form-label">Contraseña Actual</label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={currentPassword}
            onChange={handleCurrentPasswordChange}
            required
            className="form-input"
          />

          <label htmlFor="newPassword" className="form-label">Nueva Contraseña</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={newPassword}
            onChange={handleNewPasswordChange}
            required
            className="form-input"
          />

          <label htmlFor="confirmNewPassword" className="form-label">Confirma Nueva Contraseña</label>
          <input
            type="password"
            id="confirmNewPassword"
            name="confirmNewPassword"
            value={confirmNewPassword}
            onChange={handleConfirmNewPasswordChange}
            required
            className="form-input"
          />

          {/* Mostrar errores si las contraseñas no coinciden o si hay algún error en el cambio */}
          {errors && (
            <div className="error-container">
              <p className="error-message">{errors}</p>
            </div>
          )}

          {/* Mostrar mensaje de éxito si la contraseña se cambió exitosamente */}
          {message && (
            <div className="success-container">
              <p className="success-message">{message}</p>
            </div>
          )}

          <button type="submit" className="form-submit-button">Cambiar Contraseña</button>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;