import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { checkDocument, fetchCategoryAverages } from '../../utils/apiServices';
import { AuthContext } from '../../contexts/AuthContext';
import home from '../../img/svg/home.svg';
import arrow from '../../img/svg/arrow.svg';
import figure from '../../img/svg/formulario_figure.svg';
import '../../stylesheets/forms/form.css';

const DocumentVerification = ({ setUserData, setCategoryData, setIsDocumentVerified }) => {
  const { user } = useContext(AuthContext);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // Verificamos si el usuario está autenticado
        if (user && user.document) {
          // Obtenemos los datos del usuario
          const response = await checkDocument(user.document);
          console.log('API Response:', response);

          // Verificamos si el documento existe
          if (response.exists) {
            setUserData({ ...response.data, id: response.id, createdAt: response.data.created_at });

            // Obtenemos los promedios de categorías
            const categoryResponse = await fetchCategoryAverages(user.document);

            // Verificamos que la respuesta de la API para las categorías también sea correcta
            if (categoryResponse.exists) {
              setCategoryData(categoryResponse.category_averages);
            }

            setIsDocumentVerified(true);
            setErrors({});
          } else {
            setErrors({ document: 'No has realizado el autodiagnóstico.' });
          }
        } else {
          setErrors({ document: 'Usuario no autenticado.' });
        }
      } catch (error) {
        console.error('Error al obtener los resultados:', error);

        // Capturamos el error si la respuesta no es JSON válido
        if (error.message.includes('Unexpected token')) {
          setErrors({ document: 'La respuesta del servidor no es válida. Por favor, intente nuevamente más tarde.' });
        } else {
          setErrors({ document: 'Error al obtener los resultados.' });
        }
      } finally {
        setIsSubmitting(false);
      }
    };

    fetchResults();
  }, [user, setUserData, setCategoryData, setIsDocumentVerified]);

  const handleAutodiagnosticoClick = () => {
    navigate('/autodiagnostico/');
  };

  if (isSubmitting) {
    return <p>Cargando...</p>;
  }

  if (errors.document) {
    return (
      <div className="lineabase">
        <div className="notice__container">
          <div className="figure">
            <img src={figure} alt="figure" height={155} />
          </div>
          <div className="notice__options">
            <Link to={'/'}><img src={home} alt="home" /> </Link>
            <img src={arrow} alt="arrow" />
            <p className='notice__options--text'>Formulario de línea base</p>
          </div>
          <div className="notice__title--container">
            <h4 className='notice__title'>Error al obtener los resultados</h4>
          </div>
        </div>
        <div className="error-container">
          <p className="error-message">{errors.document}</p>
          <button type="button" className="autodiagnostico-button" onClick={handleAutodiagnosticoClick}>
            Realizar Autodiagnóstico
          </button>
        </div>
      </div>
    );
  }

  // Si todo va bien, no renderizamos nada aquí ya que `setIsDocumentVerified` será `true`
  return null;
};

export default DocumentVerification;