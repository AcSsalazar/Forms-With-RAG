"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { fetchForms } from "../../utils/apiServices"
import "../../stylesheets/forms/catalog.css"

function SkeletonCard() {
  return (
    <div className="fc-card fc-skeleton">
      <div className="fc-card__image shimmer" />
      <div className="fc-skel-row shimmer" />
      <div className="fc-skel-row shimmer" />
      <div className="fc-skel-row short shimmer" />
      <div className="fc-skel-btn shimmer" />
    </div>
  )
}

function FormCard({ form, onOpen }) {
  const title = form?.title || form?.name || "Formulario"
  const description =
    form?.description || "Completa este formulario para evaluar tus habilidades y obtener resultados al instante."
  const imageSrc = form?.image || "/form-card.png"

  return (
    <article className="fc-card">
      <div className="fc-card__image">
        <img src={imageSrc || "/placeholder.svg"} alt={title} loading="lazy" />
        <div className="fc-card__image-gradient" aria-hidden="true" />
      </div>

      <div className="fc-card__body">
        <h3 className="fc-card__title">{title}</h3>
        <p className="fc-card__desc">{description}</p>
      </div>

      <div className="fc-card__footer">
        <button className="fc-button" onClick={onOpen}>
          Empezar
        </button>
      </div>
    </article>
  )
}

export default function FormCatalog() {
  const [formsList, setFormsList] = useState([])
  const [loadingForms, setLoadingForms] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const loadForms = async () => {
      try {
        const form = await fetchForms()
        if (Array.isArray(form?.results)) {
          setFormsList(form.results)
        } else if (Array.isArray(form)) {
          setFormsList(form)
        } else {
          setFormsList([])
          setError("No se pudo cargar el catálogo.")
          console.error("API did not return an array:", form)
        }
      } catch (err) {
        console.error("Error al cargar formularios:", err)
        setError("Ocurrió un error al cargar los formularios.")
      } finally {
        setLoadingForms(false)
      }
    }
    loadForms()
  }, [])

  return (
    <main className="fc">
      <section className="fc-container">
        <header className="fc-header">
          <h1 className="fc-title">Catálogo de formularios</h1>
          <p className="fc-subtitle">Elige un formulario para comenzar tu evaluación.</p>
        </header>

        {loadingForms ? (
          <div className="fc-grid" aria-live="polite">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="fc-message">
            <p>{error}</p>
          </div>
        ) : formsList.length > 0 ? (
          <div className="fc-grid">
            {formsList.map((form, idx) => (
              <FormCard key={form?.id ?? idx} form={form} onOpen={() => navigate(`/form/${form.id}`)} />
            ))}
          </div>
        ) : (
          <div className="fc-message">
            <p>No se encontraron formularios.</p>
          </div>
        )}
      </section>
    </main>
  )
}
