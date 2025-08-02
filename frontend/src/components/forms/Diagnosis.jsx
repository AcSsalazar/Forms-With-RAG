import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Questions from './Questions';
import ResultsDisplay from './ResultsDisplay';
import {
  fetchFormBySlug,
  submitForm,
  checkDocument,
  fetchCategoryAverages,
} from '../../utils/apiServices';

function Diagnosis() {
  const location = useLocation();
  const navigate = useNavigate();

  const formData = location.state?.formData;

  const [currentForm, setCurrentForm] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Proteger ruta si no hay datos
  useEffect(() => {
    if (!formData || !formData.analysisType) {
      navigate('/start-form/');
    }
  }, [formData, navigate]);

  // Cargar el formulario dinámicamente
  useEffect(() => {
    const loadForm = async () => {
      try {
        setIsLoading(true);
        const form = await fetchFormBySlug(formData.analysisType);
        setCurrentForm(form);

        const savedQuestionIndex = localStorage.getItem('currentQuestionIndex');
        if (savedQuestionIndex) {
          setCurrentQuestionIndex(JSON.parse(savedQuestionIndex));
        }

        const savedAnswers = localStorage.getItem('formAnswers');
        if (savedAnswers) {
          setAnswers(JSON.parse(savedAnswers));
        }
      } catch (err) {
        console.error('Error al cargar el formulario:', err);
        setError('No se pudo cargar el formulario.');
      } finally {
        setIsLoading(false);
      }
    };

    if (formData?.analysisType) {
      loadForm();
    }
    console.log("Form data:", formData); // Debug
  }, [formData]);

  // Verificar documento al completar
  useEffect(() => {
    if (isCompleted && formData?.identificationNumber) {
      const verifyDocument = async () => {
        try {
          const response = await checkDocument(formData.identificationNumber);
          if (response.exists) {
            setUserData({
              ...response.data,
              id: response.id,
              createdAt: response.data.created_at,
            });
            const categoryResponse = await fetchCategoryAverages(formData.identificationNumber);
            if (categoryResponse.exists) {
              setCategoryData(categoryResponse.category_averages);
            }
          }
        } catch (err) {
          console.error('Error al verificar el documento:', err);
        }
      };
      verifyDocument();
    }
  }, [isCompleted, formData]);

  // Seleccionar respuesta
  const handleAnswerSelect = (answerId) => {
    if (!currentForm) return;

    const question = currentForm.questions[currentQuestionIndex];
    const answer = question.answers.find((a) => a.id === answerId);
    if (!answer) return;

    const newAnswer = {
      questionId: question.id,
      answerId: answer.id,
      value: answer.value,
      category: question.category,
      answers_count: question.answers_count,
      questionText: question.text,
      answerText: answer.text,
    };

    setSelectedAnswer(answerId);
    setAnswers((prev) => {
      const updated = prev.filter((a) => a.questionId !== question.id).concat(newAnswer);
      localStorage.setItem('formAnswers', JSON.stringify(updated));
      return updated;
    });
  };

  // Navegación entre preguntas
  const handleNavigation = (direction) => {
    if (!currentForm) return;

    if (direction === 'next' && selectedAnswer !== null) {
      if (currentQuestionIndex < currentForm.questions.length - 1) {
        const nextIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIndex);
        setSelectedAnswer(null);
        localStorage.setItem('currentQuestionIndex', JSON.stringify(nextIndex));
      } else {
        // Última pregunta
        setIsSubmitting(true);
        const submissionData = {
          answers,
          info: formData,
        };

        submitForm(
          currentForm.title,
          formData.userName,
          formData.email,
          submissionData
        )
          .then(() => {
            setIsCompleted(true);
            localStorage.removeItem('currentQuestionIndex');
            localStorage.removeItem('formAnswers');
          })
          .catch((err) => {
            console.error('Error al enviar:', err);
            setError('Error al enviar el formulario.');
          })
          .finally(() => setIsSubmitting(false));
      }
    } else if (direction === 'previous' && currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIndex);
      setSelectedAnswer(null);
      localStorage.setItem('currentQuestionIndex', JSON.stringify(prevIndex));

      // Eliminar respuesta si retrocede
      setAnswers((prev) => {
        const updated = prev.filter(
          (a) => a.questionId !== currentForm.questions[currentQuestionIndex].id
        );
        localStorage.setItem('formAnswers', JSON.stringify(updated));
        return updated;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <p>Cargando preguntas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Reintentar</button>
      </div>
    );
  }

  return (
    <>
      {!isCompleted && currentForm ? (
        <Questions
          form={currentForm}
          currentQuestionIndex={currentQuestionIndex}
          selectedAnswer={selectedAnswer}
          onSelectAnswer={handleAnswerSelect}
          onNavigate={handleNavigation}
          isSubmitting={isSubmitting}
        />
      ) : (
        <ResultsDisplay userData={userData} categoryData={categoryData} />
      )}
    </>
  );
}

export default Diagnosis;
