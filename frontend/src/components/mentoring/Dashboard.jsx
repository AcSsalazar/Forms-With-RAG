import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import MentorDashboard from './MentorDashboard';
import ApprenticeDashboard from './ApprenticeDashboard';

function Dashboard() {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Si no hay usuario y no está cargando, redirige al login
    if (!loading && !user) {
      navigate('/login/');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <p>Cargando...</p>; // Muestra un mensaje de carga mientras se obtiene la información del usuario
  }

  if (user?.is_mentor) {
    return <MentorDashboard />; // Renderiza el dashboard del mentor
  }

  if (user?.is_apprentice) {
    return <ApprenticeDashboard />; // Renderiza el dashboard del aprendiz
  }

  return <p>No se pudo determinar el rol del usuario.</p>;
}

export default Dashboard;