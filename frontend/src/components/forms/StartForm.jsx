import '../../stylesheets/startform.css';
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchForms } from '../../utils/apiServices';
import { useUser, SignedIn, SignedOut } from '@clerk/clerk-react';

function StartForm() {
  const { user } = useUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    companyName: "",
    industryArea: "",
    identificationType: "", 
    identificationNumber: "",
    occupation: "",
    selectForm: "",
    dataConsent: false,
  });

  const [formNames, setFormNames] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [loadingForms, setLoadingForms] = useState(true);

  // Cargar formularios
  useEffect(() => {
    const loadForms = async () => {
      try {
        const form = await fetchForms();
        setFormNames(Array.isArray(form.results) ? form.results : []);
      } catch (error) {
        console.error("Error al cargar formularios:", error);
      } finally {
        setLoadingForms(false);
      }
    };
    loadForms();
  }, []);

  //GUardar title del formulario
  useRef(formNames).current = formNames;
  

  // Autocompletar nombre y email desde Clerk o backend
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        userName: user?.fullName || user?.info?.userName || "",
        email: user?.primaryEmailAddress?.emailAddress || user?.info?.email || ""
      }));
    }
  }, [user]);

  // Manejo de cambios
  const handleChange = ({ target: { name, value, type, checked } }) => {
    const newValue = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
    validateField(name, newValue);
  };

  // Validación por campo
  const validateField = (name, value) => {
    let msg = "";
    if (name === "email" && !/\S+@\S+\.\S+/.test(value)) {
      msg = "Correo no válido";
    } else if (!value) {
      msg = "Este campo es obligatorio";
    }
    setErrors((prev) => ({ ...prev, [name]: msg }));
  };

  // Validación por paso
  const validateStep = () => {
    let tempErrors = {};
    if (currentStep === 1) {
      ["identificationType", "identificationNumber"].forEach((field) => { 
        if (!formData[field]) tempErrors[field] = "Este campo es obligatorio";
      });
    }
    if (currentStep === 2) {
      ["companyName", "industryArea", "occupation", "selectForm"].forEach((field) => {
        if (!formData[field]) tempErrors[field] = "Este campo es obligatorio";
      });
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Navegación de pasos
  const nextStep = () => validateStep() && setCurrentStep((p) => p + 1);
  const prevStep = () => setCurrentStep((p) => p - 1);

  // Envío del formulario
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
      <SignedIn>
        <div className="startform-container">
          <div className="startform-card">
            <div className="startform-card-body">
              <h3 className="form-header">Formulario de Registro</h3>

              {/* Stepper */}
              <div className="stepper">
                <div className={`step-item ${currentStep === 1 ? 'active' : ''}`}>
                  <span className="step-number">1</span>
                  <span className="step-label">Datos Personales</span>
                </div>
                <div className={`step-item ${currentStep === 2 ? 'active' : ''}`}>
                  <span className="step-number">2</span>
                  <span className="step-label">Datos Profesionales</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                {/* Paso 1 */}
                {currentStep === 1 && (
                  <div className="step_1">
                    <p className='user__nst'>
                      <strong className='user__st'>Nombre:</strong> 
                      {formData.userName || 'Usuario'}
                    </p>
                    <p className='user__nst'>
                      <strong className='user__st'>Email:</strong> 
                      {formData.email || 'Email no disponible'}
                    </p>

                    <select
                      name="identificationType"
                      className="form-select"
                      value={formData.identificationType}
                      onChange={handleChange}
                    >
                      <option value="">Selecciona tipo de Documento</option>
                      <option value="cedula">Cédula</option>
                      <option value="extranjera">Cédula de Extranjería</option>
                      <option value="pasaporte">Pasaporte</option>
                      <option value="otro">Otro</option>
                    </select>
                    {errors.identificationType && <span className="error-message">{errors.identificationType}</span>}

                    <input
                      type="text"
                      className="form-input"
                      name="identificationNumber"
                      placeholder="Número de identificación"  
                      value={formData.identificationNumber} 
                      onChange={handleChange} 
                    />
                    {errors.identificationNumber && <span className="error-message">{errors.identificationNumber}</span>}
                  </div>
                )}

                {/* Paso 2 */}
                {currentStep === 2 && (
                  <div className="step">
                    <input
                      type="text"
                      name="companyName"
                      className="form-input"
                      placeholder="Nombre de la empresa"
                      value={formData.companyName}
                      onChange={handleChange}
                    />
                    {errors.companyName && <span className="error-message">{errors.companyName}</span>}

                    <select
                      name="industryArea"
                      className="form-select"
                      value={formData.industryArea}
                      onChange={handleChange}
                    >
                      <option value="">Área o sector de la industria</option>
                      <option value="tecnologia">Tecnología y Software</option>
                      <option value="consultoria">Consultoría</option>
                      <option value="finanzas">Finanzas y Banca</option>
                      <option value="educacion">Educación</option>
                      <option value="salud">Salud y Bienestar</option>
                      <option value="manufactura">Manufactura</option>
                      <option value="comercio">Comercio y Ventas</option>
                      <option value="logistica">Logística y Transporte</option>
                      <option value="turismo">Turismo y Hotelería</option>
                      <option value="energia">Energía y Medio Ambiente</option>
                      <option value="otros">Otros</option>
                    </select>
                    {errors.industryArea && <span className="error-message">{errors.industryArea}</span>}

                    <select
                      name="occupation"
                      className="form-select"
                      value={formData.occupation}
                      onChange={handleChange}
                    >
                      <option value="">Ocupación</option>
                      <option value="estudiante">Estudiante</option>
                      <option value="independiente">Trabajador Independiente</option>
                      <option value="empleado-privado">Empleado del sector privado</option>
                      <option value="empleado-publico">Empleado del sector público</option>
                      <option value="emprendedor">Emprendedor</option>
                      <option value="directivo">Cargo directivo</option>
                      <option value="docente">Docente / Investigador</option>
                    </select>
                    {errors.occupation && <span className="error-message">{errors.occupation}</span>}

                    <select
                      name="selectForm"
                      className="form-select"
                      value={formData.selectForm}
                      onChange={handleChange}
                    >
                      <option value="">Selecciona tu test</option>
                      {formNames.map((form) => (
                        <option key={form.slug} value={form.slug}>
                          {form.title}
                        </option>
                      ))}
                    </select>
                    {errors.selectForm && <span className="error-message">{errors.selectForm}</span>}

                    <label className="form-checkbox">
                      <input
                        type="checkbox"
                        name="dataConsent"
                        checked={formData.dataConsent}
                        onChange={handleChange}
                      />
                      Acepto el tratamiento de datos personales
                    </label>
                  </div>
                )}

                {/* Botones */}
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
      </SignedIn>

      <SignedOut>
        <p>Para realizar el test debes iniciar sesión.</p>
      </SignedOut>
    </section>
  );
}

export default StartForm;

