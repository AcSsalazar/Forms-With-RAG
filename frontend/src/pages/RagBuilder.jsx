import { useEffect, useMemo, useState } from 'react';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  createRagFormRequest,
  uploadRagDocuments,
  generateRagForm,
  fetchRagFormRequestStatus,
} from '../utils/apiServices';
import '../stylesheets/forms/ragbuilder.css';

const defaultConfig = {
  difficulty: 'medium',
  evaluation_type: 'multiple_choice',
};

export default function RagBuilder() {
  const [formConfig, setFormConfig] = useState(defaultConfig);
  const [files, setFiles] = useState([]);
  const [formRequest, setFormRequest] = useState(null);
  const [generatedForm, setGeneratedForm] = useState(null);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const canGenerate = useMemo(() => Boolean(formRequest?.id && files.length > 0), [formRequest, files]);

  useEffect(() => {
    if (!formRequest?.id) return;
    if (!['queued', 'processing'].includes(status)) return;

    const timer = window.setInterval(async () => {
      try {
        const next = await fetchRagFormRequestStatus(formRequest.id);
        setStatus(next.status || 'idle');
        if (next.status === 'completed') {
          window.clearInterval(timer);
        }
      } catch (error) {
        setMessage(error.message || 'No se pudo consultar el estado');
        window.clearInterval(timer);
      }
    }, 3500);

    return () => window.clearInterval(timer);
  }, [formRequest?.id, status]);

  const handleFileChange = (event) => {
    setFiles(Array.from(event.target.files || []));
  };

  const handleConfigChange = (event) => {
    const { name, value } = event.target;
    setFormConfig((prev) => ({ ...prev, [name]: value }));
  };

  const startWorkflow = async () => {
    setBusy(true);
    setMessage('');
    try {
      const created = await createRagFormRequest({
        difficulty: formConfig.difficulty,
        evaluation_type: formConfig.evaluation_type,
      });
      setFormRequest(created);
      setStatus(created.status || 'queued');

      await uploadRagDocuments(created.id, files);

      const generated = await generateRagForm(created.id, {
        temperature: 0.2,
        top_p: 1.0,
        max_tokens: 4000,
      });
      setGeneratedForm(generated);
      setStatus('completed');
      setMessage('Formulario generado correctamente.');
    } catch (error) {
      setStatus('failed');
      setMessage(error.message || 'No se pudo completar el flujo RAG');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Header />
      <main className="ragb-page">
        <SignedIn>
          <section className="ragb-shell">
            <div className="ragb-hero">
              <p className="ragb-eyebrow">RAG Studio</p>
              <h1>Genera un formulario de 20 preguntas desde tus documentos</h1>
              <p>
                Sube 3 a 4 archivos, define dificultad y tipo de evaluación, y deja que el pipeline
                construya las preguntas, las respuestas correctas y la trazabilidad a las fuentes.
              </p>
            </div>

            <div className="ragb-grid">
              <section className="ragb-card">
                <h2>1. Configuración</h2>
                <label>
                  Dificultad
                  <select name="difficulty" value={formConfig.difficulty} onChange={handleConfigChange}>
                    <option value="easy">Fácil</option>
                    <option value="medium">Media</option>
                    <option value="hard">Alta</option>
                  </select>
                </label>
                <label>
                  Tipo de evaluación
                  <select name="evaluation_type" value={formConfig.evaluation_type} onChange={handleConfigChange}>
                    <option value="multiple_choice">Opción múltiple</option>
                    <option value="true_false">Verdadero/Falso</option>
                    <option value="mixed">Mixto</option>
                  </select>
                </label>

                <label>
                  Documentos de entrada
                  <input type="file" multiple accept=".pdf,.txt,.md" onChange={handleFileChange} />
                </label>

                <button type="button" className="ragb-button" disabled={busy || files.length === 0} onClick={startWorkflow}>
                  {busy ? 'Procesando...' : 'Crear y generar'}
                </button>

                <div className={`ragb-status ragb-status--${status}`}>
                  Estado: {status}
                </div>
                {message && <p className="ragb-message">{message}</p>}
              </section>

              <section className="ragb-card">
                <h2>2. Resultado</h2>
                {!generatedForm ? (
                  <p className="ragb-placeholder">Aquí aparecerá el formulario generado y sus preguntas.</p>
                ) : (
                  <div className="ragb-result">
                    <h3>{generatedForm.generated_form?.title || 'Formulario generado'}</h3>
                    <p>
                      Preguntas: {generatedForm.questions?.length || 0} | Dificultad:{' '}
                      {generatedForm.generated_form?.difficulty || formConfig.difficulty}
                    </p>
                    <ol>
                      {(generatedForm.questions || []).map((question) => (
                        <li key={question.id}>
                          <strong>{question.index}.</strong> {question.question_text}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </section>
            </div>
          </section>
        </SignedIn>

        <SignedOut>
          <section className="ragb-shell ragb-shell--locked">
            <div className="ragb-card">
              <h2>Inicia sesión para usar RAG Studio</h2>
              <p>Esta herramienta requiere autenticación para crear y generar formularios.</p>
            </div>
          </section>
        </SignedOut>
      </main>
      <Footer />
    </>
  );
}