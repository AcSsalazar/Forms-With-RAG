import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import DocumentVerification from './DocumentVerification';
import ResultsDisplay from './ResultsDisplay';
import { AuthContext } from '../../contexts/AuthContext';

function Results() {
  const { user, loading } = useContext(AuthContext);
  const [isDocumentVerified, setIsDocumentVerified] = useState(false);
  const [userData, setUserData] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login/');
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return <p>Cargando...</p>;
  }

  return (
    <>
      {!isDocumentVerified ? (
        <DocumentVerification
          setUserData={setUserData}
          setCategoryData={setCategoryData}
          setIsDocumentVerified={setIsDocumentVerified}
        />
      ) : (
        <ResultsDisplay
          userData={userData}
          categoryData={categoryData}
        />
      )}
    </>
  );
}

export default Results;