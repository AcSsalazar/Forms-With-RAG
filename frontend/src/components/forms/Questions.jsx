import React from 'react';
import '../../stylesheets/forms/question.css';
import { Link } from 'react-router-dom';
import home from '../../img/svg/home.svg';
import arrow from '../../img/svg/arrow.svg';
import figure from '../../img/svg/formulario_figure.svg';

function Questions({ form, currentQuestionIndex, selectedAnswer, onSelectAnswer, onNavigate, isSubmitting }) {

  const progress = Math.floor((currentQuestionIndex / form.questions.length) * 100);

  return (
    <div className='formulario-container'>
      <div className="figure__container">
        <img src={figure} className='figure__container--image' alt="figure" width={220} />
      </div>

      <div className="nav__options">
        <div className='nav__options--home'>
          <Link to={'/'}><img src={home} alt="home" width={16} height={16} /> </Link>
          <img src={arrow} alt="arrow" width={16} height={16} />
          <p className='nav__options--text'>{form.title}</p>
        </div>
        <h4 className='formulario__type'>{form.title}</h4>
      </div>

      <div className='formulario'>
        <div className="progress" style={{ height: "12px" }}>
          <div className="progress-bar progress-bar-greendegree" role="progressbar" style={{ width: `${progress}%`, color: "#454854" }} aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">{`${progress}%`}</div>
        </div>

        <div className='formulario__info'>
          <p className='formulario-number'>Pregunta {currentQuestionIndex + 1} de {form.questions.length}</p>
          <p className='formulario-question'>{form.questions[currentQuestionIndex].text}</p>
        </div>

        <div className='formulario-buttons'>
          <p className='pick__question'>selecciona tu respuesta</p>
          {form.questions[currentQuestionIndex].answers.map((answer) => (
            <button
              className='buttons-question'
              key={answer.id}
              onClick={() => onSelectAnswer(answer.id)}
              disabled={isSubmitting}
              style={{
                backgroundColor: selectedAnswer === answer.id ? "#9AD0FF" : ""
              }}
            >
              {answer.text}
            </button>
          ))}
        </div>

        <div className='buttons__neprev'>
          {currentQuestionIndex > 0 && (
            <button className='buttons-question neprev' onClick={() => onNavigate('previous')}>Anterior</button>
          )}
          <button
            className='buttons-question neprev'
            onClick={() => onNavigate('next')}
            disabled={isSubmitting || selectedAnswer === null}
          >
            {currentQuestionIndex < form.questions.length - 1 ? "Siguiente" : "Finalizar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Questions;