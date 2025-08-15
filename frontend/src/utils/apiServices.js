


const getCsrfToken = () => {
  const name = 'csrftoken';
  const cookieValue = document.cookie.split('; ').find(row => row.startsWith(name))?.split('=')[1];
  return cookieValue;
};

const CLIENT_TOKEN = process.env.REACT_APP_CLIENT_TOKEN; // Token sincronizado con el backend
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL; // Base URL para las APIs

// Funciones para los formularios

export const fetchForms = async () => {
  const response = await fetch(`${API_BASE_URL}/forms/forms/`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'X-Client-Token': CLIENT_TOKEN,
    },
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
    headers: {
      'X-Client-Token': CLIENT_TOKEN,
    },
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
    headers: {
      'X-Client-Token': CLIENT_TOKEN,
    },
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
    headers: {
      'X-Client-Token': CLIENT_TOKEN,
    },
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
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCsrfToken(),
      'X-Client-Token': CLIENT_TOKEN,
    },
    credentials: 'include',
    body: JSON.stringify(completedFormData),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const fetchCategoryAverages = async (documentNumber) => {
  const response = await fetch(`${API_BASE_URL}/forms/category-averages/${documentNumber}/`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'X-Client-Token': CLIENT_TOKEN,
    },
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

