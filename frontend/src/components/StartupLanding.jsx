import React from 'react'
import { Link } from 'react-router-dom'
import '../stylesheets/home/home.css'
import heroImage from '../img/001.svg'
import Typewriter from './forms/TypeWriter'


const Hero = () => {
  
const text =  ` $Hola visitante soy Julia Bot (❛‿❛):

Este proyecto evalúa tus respuestas y te otorga una calificación personalizada,
acompañada de retroalimentación generada a partir de documentos del sistema RAG.
Puedes elegir entre los siguientes modelos de IA para el análisis:

* LLaMA 4 Maverik 

* OpenAI GPT-OSS 20B.`;


  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-noise" aria-hidden="true" />
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="dot" aria-hidden="true" /><Link to='http://acsalazar.com' style={{color: "white"}} > By acsalazar </Link>
          </div>
          <h1 id="hero-title" className="hero-title">
            Obtén un
            <span className="hero-title-accent"> análisis preciso  </span>
             a partir de tus resultados del Test
          </h1>
          <p className="hero-subtitle">
            Selecciona uno de nuestros formularios y evalúa tus habilidades ahora mismo.
          </p>
          <div className="hero-cta">
            <Link to="/start-form" className="hero-button primary" aria-label="Comenzar registro">
              Empezar Aquí
            </Link>
            <Link to="/catalog" className="hero-button secondary" aria-label="Ver catálogo de formularios">
              Catálogo de Formularios
            </Link>
          </div>
        </div>

<div className="hero-art">
  <div className="hero-image-wrapper">
    <img
      src={heroImage || "/img/001.svg"}
      alt="Ilustración de digitalización y análisis de datos"
      className="hero-image"
      loading="eager"
    />
    <div className="hero-text-overlay">
      <p>
        <Typewriter text={text} speed={50} />
      </p>
    </div>
  </div>
</div>
      </div>
    </section>
  )
}

const Features = () => {
  const features = [
    { title: 'Login con Goolge o GitHub', description: 'Inicia sesion con tu cuenta de manera segura.', icon: '📬' },
    { title: 'GTP-oss', description: 'Nuestro sistema esta potenciado por el modelo oss de Open IA.', icon: '👾' },
    { title: 'Open Source', description: 'Te ha gustado el proyecto ? Recuerda que esta disponible de manera gratuita en mi repositorio de Github.', icon: '🛸' },
  ]

  return (
    <section className="features" aria-labelledby="features-title">
      <div className="container">
        <h2 id="features-title" className="section-title">
          Características destacadas
        </h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <article key={index} className="feature-card">
              <div className="feature-card-bg" aria-hidden="true" />
              <div className="feature-icon" aria-hidden="true">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

const Testimonials = () => {
  const testimonials = [
    { name: 'Brendan Eich', role: 'Creador de Java Script', quote: 'La web debería ser una plataforma para la innovación, no un conjunto de jardines amurallados.' },
    { name: 'Linus Torvalds', role: 'Creador de Linux', quote: 'El verdadero poder del open source es la colaboración, no la gratuidad.' },
  ]

  return (
    <section className="testimonials" aria-labelledby="testimonials-title">
      <div className="container">
        <h2 id="testimonials-title" className="section-title">Open Source:</h2>
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <figure key={i} className="testimonial-card">
              <blockquote className="testimonial-quote">“{t.quote}”</blockquote>
              <figcaption className="testimonial-author">{t.name}, {t.role}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

const Pricing = () => {
  const plans = [
    { name: 'Documentacion', price: '$0', features: ['Documentación', 'Acceso al Repositorio', 'No incluye API Keys'] },
    { name: 'Asistencia Personalizada', price: '$100', features: ['Guia paso a paso para crear esta app', 'Atencion Personal', 'Incluye API keys por 7 días'], popular: true },
  ]

  return (
    <section className="pricing" aria-labelledby="pricing-title">
      <div className="container">
        <h2 id="pricing-title" className="section-title">Servicios Disponibles</h2>
        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <article key={index} className={`pricing-card ${plan.popular ? 'popular' : ''}`} aria-label={`Plan ${plan.name}`}>
              {plan.popular && <div className="pricing-badge" aria-label="Plan más popular">Más Popular</div>}
              <h3 className="pricing-title">{plan.name}</h3>
              <p className="pricing-price">
                <span className="pricing-amount">{plan.price}</span>
                <span className="pricing-cycle">/mes</span>
              </p>
              <ul className="pricing-features">
                {plan.features.map((feature, i) => (
                  <li key={i} className="pricing-feature">
                    <span className="check" aria-hidden="true">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link to="/signup" className={`pricing-button ${plan.popular ? 'primary' : 'secondary'}`}>
                Elegir {plan.name}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

const Home = () => {
  return (
    <main className="home">
      <Hero />
      <Features />
      <Testimonials />
      <Pricing />
    </main>
  )
}

export default Home