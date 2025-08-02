
import '../../stylesheets/startform.css';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchForms } from '../../utils/apiServices';


function StartForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    identificationType: "",
    identificationNumber: "",
    companyName: "",
    marketReach: "",
    analysisType: "",
    dataConsent: false,
  });

  const [formNames, setFormNames] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [loadingForms, setLoadingForms] = useState(true);

  // Cargar nombres de formularios
useEffect(() => {
  const loadForms = async () => {
    try {
      const form = await fetchForms();
      console.log("API response:", form); // Debug
      if (Array.isArray(form.results)) {
        setFormNames(form.results);
      } else {
        setFormNames([]); // or handle error
        console.error("API did not return an array:", form);
      }
    } catch (error) {
      console.error("Error al cargar formularios:", error);
    } finally {
      setLoadingForms(false);
    }
  };
  loadForms();
}, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    validateField(name, type === "checkbox" ? checked : value);
  };

  const validateField = (name, value) => {
    let tempErrors = { ...errors };
    switch (name) {
      case "email":
        tempErrors[name] = /\S+@\S+\.\S+/.test(value) ? "" : "Correo no válido";
        break;
      default:
        tempErrors[name] = value ? "" : "Este campo es obligatorio";
        break;
    }
    setErrors(tempErrors);
  };

  const validateStep = () => {
    let tempErrors = {};
    if (currentStep === 1) {
      ["userName", "email", "identificationType", "identificationNumber"].forEach((field) => {
        if (!formData[field]) tempErrors[field] = "Este campo es obligatorio";
      });
      if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
        tempErrors.email = "Correo no válido";
      }
    }
    if (currentStep === 2) {
      ["companyName", "marketReach", "analysisType"].forEach((field) => {
        if (!formData[field]) tempErrors[field] = "Este campo es obligatorio";
      });
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.dataConsent) {
      alert("Debe autorizar el tratamiento de datos.");
      return;
    }
    if (validateStep()) {
      navigate("/diagnostico", { state: { formData } });
    }
  };

  if (loadingForms) return <p>Cargando formularios...</p>;
  return (
    <section className="startform-section">
      <div className="startform-container">
        <div className="startform-card">
          <div className="startform-card-body">
            <h3 className="form-header">Formulario de inicio</h3>

            <div className="stepper">
              <div className={`step-item ${currentStep === 1 ? 'active' : ''}`}>
                <span className="step-number">1</span>
                <span className="step-label">Datos personales</span>
              </div>
              <div className={`step-item ${currentStep === 2 ? 'active' : ''}`}>
                <span className="step-number">2</span>
                <span className="step-label">Empresa</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              {currentStep === 1 && (
                <div className="step">
                  <input
                    type="text"
                    name="userName"
                    className="form-input"
                    placeholder="Nombre completo"
                    value={formData.userName}
                    onChange={handleChange}
                  />
                  {errors.userName && <span className="error-message">{errors.userName}</span>}

                  <input
                    type="email"
                    name="email"
                    className="form-input"
                    placeholder="Correo electrónico"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}

                  <select
                    name="identificationType"
                    className="form-select"
                    value={formData.identificationType}
                    onChange={handleChange}
                  >
                    <option value="">Tipo de documento</option>
                    <option value="cc">Cédula</option>
                    <option value="ce">Cédula extranjería</option>
                    <option value="pasaporte">Pasaporte</option>
                  </select>
                  {errors.identificationType && <span className="error-message">{errors.identificationType}</span>}

                  <input
                    type="text"
                    name="identificationNumber"
                    className="form-input"
                    placeholder="Número de identificación"
                    value={formData.identificationNumber}
                    onChange={handleChange}
                  />
                  {errors.identificationNumber && <span className="error-message">{errors.identificationNumber}</span>}
                </div>
              )}

              {currentStep === 2 && (
                <div className="step">
                  <input
                    type="text"
                    name="companyName"
                    className="form-input"
                    placeholder="Nombre de empresa"
                    value={formData.companyName}
                    onChange={handleChange}
                  />
                  {errors.companyName && <span className="error-message">{errors.companyName}</span>}

                  <select
                    name="marketReach"
                    className="form-select"
                    value={formData.marketReach}
                    onChange={handleChange}
                  >
                    <option value="">Alcance de mercado</option>
                    <option value="micro">Microempresa</option>
                    <option value="pyme">Pyme</option>
                    <option value="grande">Grande</option>
                  </select>
                  {errors.marketReach && <span className="error-message">{errors.marketReach}</span>}

                  <select
                    name="analysisType"
                    className="form-select"
                    value={formData.analysisType}
                    onChange={handleChange}
                  >
                    <option value="">Tipo de test</option>
                    {formNames.map((form) => (
                      <option key={form.slug} value={form.slug}>
                        {form.title}
                      </option>
                    ))}
                  </select>
                  {errors.analysisType && <span className="error-message">{errors.analysisType}</span>}

                  <label className="form-checkbox">
                    <input
                      type="checkbox"
                      name="dataConsent"
                      checked={formData.dataConsent}
                      onChange={handleChange}
                    />
                    Acepto tratamiento de datos
                  </label>
                </div>
              )}

              <div className="actions">
                {currentStep > 1 && (
                  <button type="button" className="btn btn-secondary" onClick={prevStep}>
                    Atrás
                  </button>
                )}
                {currentStep < 2 && (
                  <button type="button" className="btn btn-primary" onClick={nextStep}>
                    Siguiente
                  </button>
                )}
                {currentStep === 2 && (
                  <button type="submit" className="btn btn-primary">
                    Comenzar diagnóstico
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StartForm;