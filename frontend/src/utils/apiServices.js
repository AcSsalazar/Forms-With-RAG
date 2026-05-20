


// CORRECCIÓN: Sintaxis correcta de Vite para variables de entorno
const CLIENT_TOKEN = import.meta.env.VITE_CLIENT_TOKEN;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getCsrfToken = () => {
  const name = 'csrftoken';
  const cookieValue = document.cookie.split('; ').find(row => row.startsWith(name))?.split('=')[1];
  return cookieValue;
};

const getClerkToken = async () => {
  const clerk = window?.Clerk;
  if (!clerk?.session) return null;
  return clerk.session.getToken();
};

const buildHeaders = async (extra = {}) => {
  const headers = {
    ...extra,
  };
  if (CLIENT_TOKEN) {
    headers['X-Client-Token'] = CLIENT_TOKEN;
  }
  const token = await getClerkToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};
// Funciones para los formularios

export const fetchForms = async () => {
  const response = await fetch(`${API_BASE_URL}/forms/forms/`, {
    method: 'GET',
    credentials: 'include',
    headers: await buildHeaders(),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};


export const fetchFormBySlug = async (formSlug) => {
  const response = await fetch(`${API_BASE_URL}/forms/form/${formSlug}/`, {
    method: 'GET',
    credentials: 'include',
    headers: await buildHeaders(),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const checkDocument = async (documentNumber) => {
  const response = await fetch(`${API_BASE_URL}/forms/completed-forms/check/${documentNumber}/`, {
    method: 'GET',
    credentials: 'include',
    headers: await buildHeaders(),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();


};



export const formsByDocument = async (documentNumber) => {
  const response = await fetch(`${API_BASE_URL}/forms/completed-forms/by-document/${documentNumber}/`, { 
    method: 'GET',
    credentials: 'include',
    headers: await buildHeaders(),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();


};

export const submitForm = async (formTitle, userName, email, dataToSubmit) => {
  const completedFormData = {
    form_title: formTitle,
    user: userName,
    email: email,
    content: dataToSubmit,
  };

  const response = await fetch(`${API_BASE_URL}/forms/completed-forms/`, {
    method: 'POST',
    headers: await buildHeaders({
      'Content-Type': 'application/json',
      'X-CSRFToken': getCsrfToken(),
    }),
    credentials: 'include',
    body: JSON.stringify(completedFormData),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};


export const fetchPersonalizedResults = async (documentNumber) => {
  const response = await fetch(`${API_BASE_URL}/forms/llmtext/${documentNumber}/`, 
    {
    method: 'GET',
    credentials: 'include',
    headers: await buildHeaders(),
    });
  if (!response.ok)

    throw new Error("Error al obtener resultados personalizados");

  return response.json();
};




export const fetchCategoryAverages = async (documentNumber) => {
  const response = await fetch(`${API_BASE_URL}/forms/category-averages/${documentNumber}/`, {
    method: 'GET',
    credentials: 'include',
    headers: await buildHeaders(),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

