import axios from 'axios';

const getCsrfToken = () => {
  const name = 'csrftoken';
  const cookieValue = document.cookie.split('; ').find(row => row.startsWith(name))?.split('=')[1];
  return cookieValue;
};

const CLIENT_TOKEN = process.env.REACT_APP_CLIENT_TOKEN; // Token sincronizado con el backend
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL; // Base URL para las APIs

// Funciones para el usuario

export const registerUser = async (document, email, full_name, password) => {
  const response = await axios.post(`${API_BASE_URL}/users/register/`, {
    document,
    email,
    full_name,
    password,
  }, {
    headers: {
      'X-CSRFToken': getCsrfToken(),
    },
    withCredentials: true,
  });
  return response.data;
};

export const loginUser = async (document, password) => {
  const response = await axios.post(`${API_BASE_URL}/users/login/`, {
    document,
    password,
  }, {
    headers: {
      'X-CSRFToken': getCsrfToken(),
    },
    withCredentials: true,
  });
  return response.data;
};

export const logoutUser = async (refreshToken, accessToken) => {
  await axios.post(`${API_BASE_URL}/users/logout/`, { refresh: refreshToken }, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'X-CSRFToken': getCsrfToken(),
    },
    withCredentials: true,
  });
};

export const getUserDetails = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/users/info/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-CSRFToken': getCsrfToken(),
    },
    withCredentials: true,
  });
  return response.data;
};

export const getUserProfile = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/users/profile/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-CSRFToken': getCsrfToken(),
    },
    withCredentials: true,
  });
  return response.data;
};

export const updateUserProfile = async (token, formData) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/users/profile/`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-CSRFToken': getCsrfToken(),
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const sendPasswordResetEmail = async (email) => {
  const response = await axios.post(`${API_BASE_URL}/users/reset-password/`, {
    email,
  }, {
    headers: {
      'X-CSRFToken': getCsrfToken(),
    },
    withCredentials: true,
  });
  return response.data;
};

export const resetPassword = async (token, newPassword) => {
  const response = await axios.post(`${API_BASE_URL}/users/reset-password-confirm/`, {
    token,
    new_password: newPassword,
  }, {
    headers: {
      'X-CSRFToken': getCsrfToken(),
    },
    withCredentials: true,
  });
  return response.data;
};

// apiServices.js

export const changePassword = async (token, currentPassword, newPassword) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/change-password/`, {
      current_password: currentPassword,
      new_password: newPassword
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-CSRFToken': getCsrfToken(),
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    // Manejar el error
    throw error;
  }
};

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

// Nuevas funciones para el mentor

export const getMentorAvailability = async (token, mentorId) => {
  const response = await axios.get(`${API_BASE_URL}/mentoring/mentor-availability/?mentor=${mentorId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-CSRFToken': getCsrfToken(),
    },
    withCredentials: true,
  });
  return response.data;
};

export const createAvailability = async (token, availabilityData) => {
  const response = await axios.post(`${API_BASE_URL}/mentoring/availability/`, availabilityData, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-CSRFToken': getCsrfToken(),
    },
    withCredentials: true,
  });
  return response.data;
};

export const deleteAvailability = async (token, availabilityId) => {
  const response = await axios.delete(`${API_BASE_URL}/mentoring/availability/${availabilityId}/`, {
      headers: {
          'Authorization': `Bearer ${token}`,
          'X-CSRFToken': getCsrfToken(),
      },
      withCredentials: true,
  });
  return response.data;
};

export const getMentorSessions = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/mentoring/mentor-sessions/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-CSRFToken': getCsrfToken(),
    },
    withCredentials: true,
  });
  return response.data;
};

export const updateSessionStatus = async (token, sessionId, action) => {
  const response = await axios.patch(`${API_BASE_URL}/mentoring/update-session-status/${sessionId}/`, { action }, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-CSRFToken': getCsrfToken(),
    },
    withCredentials: true,
  });
  return response.data;
};

export const getApprenticeSessions = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/mentoring/apprentice-sessions/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-CSRFToken': getCsrfToken(),
    },
    withCredentials: true,
  });
  return response.data;
};

export const getAvailableMentors = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/mentoring/available-mentors/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-CSRFToken': getCsrfToken(),
    },
    withCredentials: true,
  });
  return response.data;
};

export const bookSession = async (token, availabilityId, subject, description) => {
  const response = await axios.post(`${API_BASE_URL}/mentoring/book-session/`, {
    availability: availabilityId,
    subject,
    description
  }, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-CSRFToken': getCsrfToken(),
    },
    withCredentials: true,
  });
  return response.data;
};

export const updateMentorAbout = async (token, mentorId, about) => {
  const response = await axios.patch(`${API_BASE_URL}/mentoring/update-mentor-about/${mentorId}/`, 
    { about }, 
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-CSRFToken': getCsrfToken(),
      },
      withCredentials: true,
    }
  );
  return response.data;
};

export const updateMentorCategories = async (token, mentorId, categories) => {
  const response = await axios.patch(`${API_BASE_URL}/mentoring/update-mentor-categories/${mentorId}/`, 
    { categories }, 
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-CSRFToken': getCsrfToken(),
      },
      withCredentials: true,
    }
  );
  return response.data;
};

export const fetchCategories = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/mentoring/categories/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-CSRFToken': getCsrfToken(),
    },
    withCredentials: true,
  });
  return response.data;
};

export const rateMentor = async (token, mentorId, rating) => {
  const response = await fetch(`${API_BASE_URL}/mentoring/rate_mentor/${mentorId}/`, {  // Asegúrate que mentorId no sea undefined
      method: 'PATCH',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-CSRFToken': getCsrfToken(),
      },
      body: JSON.stringify({ rating }),
  });

  if (!response.ok) {
      throw new Error('Error al calificar al mentor');
  }
};

export const updateMentorProfilePhoto = async (token, formData) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/mentoring/update-mentor-photo/`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-CSRFToken': getCsrfToken(),
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteMentorProfilePhoto = async (token) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/mentoring/update-mentor-photo/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-CSRFToken': getCsrfToken(),
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};