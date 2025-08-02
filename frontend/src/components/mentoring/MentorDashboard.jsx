import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../stylesheets/mentoring/mentordashboard.css';
import { AuthContext } from '../../contexts/AuthContext';
import { getMentorSessions, createAvailability, getMentorAvailability, deleteAvailability, getUserDetails, updateSessionStatus, updateMentorAbout, updateMentorCategories, fetchCategories, updateMentorProfilePhoto, deleteMentorProfilePhoto } from '../../utils/apiServices';

function MentorDashboard() {
    const { user } = useContext(AuthContext);
    const [sessions, setSessions] = useState([]);
    const [availability, setAvailability] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [startTime, setStartTime] = useState(null);
    const [link, setLink] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingActions, setLoadingActions] = useState({});
    const [about, setAbout] = useState('');
    const [rating, setRating] = useState(0);
    const [editAbout, setEditAbout] = useState(false);
    const [allCategories, setAllCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [editCategories, setEditCategories] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [profilePhotoUrl, setProfilePhotoUrl] = useState('');
    const [editPhoto, setEditPhoto] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login/');
        }
    }, [user, navigate]);

    useEffect(() => {
        if (user && user.profile_photo_url) {
            setProfilePhotoUrl(user.profile_photo_url);
        }
    }, [user]);

    const loadSessions = useCallback(async () => {
        try {
            const data = await getMentorSessions(user.token);
            setSessions(Array.isArray(data.results) ? data.results : []);
        } catch (error) {
            console.error('Failed to load sessions', error);
        }
    }, [user?.token]);

    const loadAvailability = useCallback(async () => {
        try {
            const data = await getMentorAvailability(user.token, user.id);  
            const currentDate = new Date();
            const filteredAvailability = Array.isArray(data.results) 
                ? data.results.filter(slot => new Date(slot.date) >= currentDate)
                : [];
            setAvailability(filteredAvailability);
        } catch (error) {
            console.error('Failed to load availability', error);
        }
    }, [user?.token, user?.id]);

    const addCacheBuster = (url) => url ? `${url}${url.includes('?') ? '&' : '?'}t=${new Date().getTime()}` : '';

    const loadUserDetails = useCallback(async () => {
        try {
            const data = await getUserDetails(user.token);
            setAbout(data.about || '');
            setRating(data.rating || 0);
            setSelectedCategories(data.categories.map(category => category.id) || []);
            setProfilePhotoUrl(addCacheBuster(data.profile_photo_url || ''));
        } catch (error) {
            console.error('Failed to load user details', error);
        }
    }, [user?.token]);

    const loadCategories = useCallback(async () => {
        try {
            const data = await fetchCategories(user.token);
            setAllCategories(data.results || []);
        } catch (error) {
            console.error('Failed to load categories', error);
        }
    }, [user?.token]);

    useEffect(() => {
        if (user && user.token) {
            loadSessions();
            loadAvailability();
            loadUserDetails();
            loadCategories();
        }
    }, [user, loadSessions, loadAvailability, loadUserDetails, loadCategories]);

    const handleLinkChange = (event) => {
        setLink(event.target.value);
    };

    const handleCreateAvailability = async () => {
        if (!startTime) {
            alert("Por favor selecciona una hora de inicio.");
            return;
        }

        const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000);

        setLoading(true);

        try {
            const formattedStartTime = startTime.toLocaleTimeString('es-CO', { timeZone: 'America/Bogota', hour12: false });
            const formattedEndTime = endTime.toLocaleTimeString('es-CO', { timeZone: 'America/Bogota', hour12: false });
            const formattedDate = selectedDate.toISOString().split('T')[0];

            const availabilityData = {
                mentor: user.id,
                mentor_name: user.full_name,
                date: formattedDate,
                start_time: formattedStartTime,
                end_time: formattedEndTime,
                link
            };

            await createAvailability(user.token, availabilityData);
     
            loadAvailability();
            setShowCreateForm(false);
            setSelectedDate(new Date());
            setStartTime(null);
            setLink('');
        } catch (error) {
            console.error('Failed to create availability', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAvailability = async (availabilityId) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar esta disponibilidad?")) {
            try {
                await deleteAvailability(user.token, availabilityId);
                loadAvailability();
            } catch (error) {
                console.error('Failed to delete availability', error);
            }
        }
    };

    const handleConfirmSession = async (sessionId) => {
        if (window.confirm("¿Estás seguro de que quieres confirmar esta sesión?")) {
            setLoadingActions((prev) => ({ ...prev, [sessionId]: 'confirming' }));
            try {
                await updateSessionStatus(user.token, sessionId, 'confirm');
                loadSessions(); 
            } catch (error) {
                console.error('Failed to confirm session', error);
            } finally {
                setLoadingActions((prev) => ({ ...prev, [sessionId]: null }));
            }
        }
    };

    const handleRejectSession = async (sessionId) => {
        if (window.confirm("¿Estás seguro de que quieres rechazar esta sesión?")) {
            setLoadingActions((prev) => ({ ...prev, [sessionId]: 'rejecting' }));
            try {
                await updateSessionStatus(user.token, sessionId, 'reject');
                loadSessions(); 
                loadAvailability(); 
            } catch (error) {
                console.error('Failed to reject session', error);
            } finally {
                setLoadingActions((prev) => ({ ...prev, [sessionId]: null }));
            }
        }
    };

    const handleCreateButtonClick = () => {
        setShowCreateForm(true);
    };

    const handleAboutChange = (event) => {
        setAbout(event.target.value);
    };

    const handleAboutSave = async () => {
        setLoading(true);
        try {
            await updateMentorAbout(user.token, user.id, about);
            setEditAbout(false);
        } catch (error) {
            console.error('Failed to update about', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (event) => {
        const categoryId = parseInt(event.target.value);
        if (event.target.checked) {
            setSelectedCategories([...selectedCategories, categoryId]);
        } else {
            setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
        }
    };

    const handleCategoriesSave = async () => {
        setLoading(true);
        try {
            await updateMentorCategories(user.token, user.id, selectedCategories);
            setEditCategories(false);
        } catch (error) {
            console.error('Failed to update categories', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setProfilePhoto(file);
        }
    };

    const handlePhotoSave = async () => {
        if (!profilePhoto) {
            alert('Por favor selecciona una foto.');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('profile_photo', profilePhoto);

            const response = await updateMentorProfilePhoto(user.token, formData);
            setProfilePhotoUrl(addCacheBuster(response.profile_photo_url));
            setProfilePhoto(null);
            setEditPhoto(false);
            alert('Foto de perfil actualizada exitosamente.');
        } catch (error) {
            console.error('Failed to update profile photo', error);
            alert('Error al actualizar la foto de perfil.');
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoDelete = async () => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar tu foto de perfil?')) return;
        setLoading(true);
        try {
            const response = await deleteMentorProfilePhoto(user.token);
            setProfilePhotoUrl(addCacheBuster(response.profile_photo_url));
            setProfilePhoto(null);
            setEditPhoto(false);
            alert('Foto de perfil eliminada.');
        } catch (error) {
            console.error('Error al eliminar la foto de perfil', error);
            alert('No se pudo eliminar la foto de perfil.');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return null;
    }

    const currentDateTime = new Date();

    const confirmedSessions = sessions.filter(session => 
        session.is_confirmed && new Date(session.date) >= currentDateTime
    );
    const unconfirmedSessions = sessions.filter(session => 
        !session.is_confirmed && new Date(session.date) >= currentDateTime
    );
    const completedSessions = sessions.filter(session => 
        session.is_confirmed && new Date(session.date) < currentDateTime
    );

    return (
        <div className="mentor-dashboard">
            <div className="dashboard-column">
                <section className="dashboard-section">
                    <h3>Bienvenido, {user?.full_name}</h3>
                </section>
                <section className="dashboard-section">
                    <h4>Sesiones Confirmadas</h4>
                    {confirmedSessions.length > 0 ? (
                        <ul className="dashboard-list">
                            {confirmedSessions.map((session) => (
                                <li key={session.id}>
                                    <a href={session.link} target="_blank" rel="noopener noreferrer">
                                        {session.subject} con {session.apprentice_full_name} el {session.date} a las {session.start_time}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No hay sesiones confirmadas</p>
                    )}
                </section>
                <section className="dashboard-section">
                    <h4>Sesiones No Confirmadas</h4>
                    {unconfirmedSessions.length > 0 ? (
                        <ul className="dashboard-list">
                            {unconfirmedSessions.map((session) => (
                                <li key={session.id}>
                                    {session.subject} con {session.apprentice_full_name} el {session.date} a las {session.start_time}
                                    <div className='dashboard-buttons'>
                                        <button 
                                            className="dashboard-button"
                                            onClick={() => handleConfirmSession(session.id)} 
                                            disabled={loadingActions[session.id] === 'confirming'}
                                        >
                                            {loadingActions[session.id] === 'confirming' ? 'Confirmando...' : 'Confirmar'}
                                        </button>
                                        <button 
                                            className="dashboard-button"
                                            onClick={() => handleRejectSession(session.id)} 
                                            disabled={loadingActions[session.id] === 'rejecting'}
                                        >
                                            {loadingActions[session.id] === 'rejecting' ? 'Rechazando...' : 'Rechazar'}
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No hay sesiones no confirmadas</p>
                    )}
                </section>
                <section className="dashboard-section">
                    <h4>Sesiones Finalizadas</h4>
                    {completedSessions.length > 0 ? (
                        <ul className="dashboard-list">
                            {completedSessions.map((session) => (
                                <li key={session.id}>
                                    <p>{session.subject} con {session.apprentice_full_name} el {session.date} a las {session.start_time}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No hay sesiones finalizadas</p>
                    )}
                </section>
            </div>
            
            <div className="dashboard-column">
                <section className="dashboard-section">
                    <h4>Disponibilidad</h4>
                    {availability.length > 0 ? (
                        <ul className="dashboard-list">
                            {availability.map((slot) => (
                                <li key={slot.id}>
                                    {slot.date} de {slot.start_time} a {slot.end_time}
                                    <button 
                                        className="dashboard-button"
                                        onClick={() => handleDeleteAvailability(slot.id)} 
                                        disabled={loading}
                                    >
                                        Eliminar
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No hay disponibilidad registrada</p>
                    )}
                    <button 
                        className="dashboard-button"
                        onClick={handleCreateButtonClick} 
                        disabled={loading}
                    >
                        {loading ? 'Creando...' : 'Crear Disponibilidad'}
                    </button>
                </section>
                {showCreateForm && (
                    <section className="dashboard-section">
                        <h4>Crear Nueva Disponibilidad</h4>
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            inline
                            disabled={loading}
                        />
                        <div className="time-slots">
                            <h4>Seleccionar Hora de Inicio</h4>
                            <DatePicker
                                selected={startTime}
                                onChange={(time) => setStartTime(time)}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={60}
                                timeCaption="Inicio"
                                dateFormat="HH:mm"
                                disabled={loading}
                            />
                        </div>
                        <div className="link">
                            <h4>Link de la Mentoría</h4>
                            <input
                                className="dashboard-input"
                                type="text"
                                value={link}
                                onChange={handleLinkChange}
                                disabled={loading}
                            />
                        </div>
                        <button 
                            className="dashboard-button"
                            onClick={handleCreateAvailability} 
                            disabled={loading}
                        >
                            {loading ? 'Creando...' : 'Crear Disponibilidad'}
                        </button>
                        <button 
                            className="dashboard-button"
                            onClick={() => {
                                setShowCreateForm(false); // Ocultar el formulario
                                setSelectedDate(new Date()); // Restablecer fecha seleccionada
                                setStartTime(null); // Restablecer hora de inicio
                                setLink(''); // Restablecer link
                            }} 
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                    </section>
                )}
            </div>
            
            <div className="dashboard-column">
                <section className="dashboard-section">
                    <h4>Foto de Perfil</h4>
                    {editPhoto ? (
                        <>
                            <div className="photo-upload">
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                    disabled={loading}
                                    className="dashboard-file-input"
                                />
                                {profilePhoto && (
                                    <p className="file-selected">Archivo seleccionado: {profilePhoto.name}</p>
                                )}
                            </div>
                            <div className="dashboard-buttons">
                                <button 
                                    className="dashboard-button"
                                    onClick={handlePhotoSave} 
                                    disabled={loading || !profilePhoto}
                                >
                                    {loading ? 'Guardando...' : 'Guardar Foto'}
                                </button>
                                <button 
                                    className="dashboard-button"
                                    onClick={() => {
                                        setEditPhoto(false);
                                        setProfilePhoto(null);
                                    }} 
                                    disabled={loading}
                                >
                                    Cancelar
                                </button>
                                {profilePhotoUrl && !profilePhotoUrl.includes('placeholder.png') && (
                                    <button 
                                        className="dashboard-button"
                                        onClick={handlePhotoDelete}
                                        disabled={loading}
                                    >
                                        Eliminar Foto
                                    </button>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="profile-photo-container">
                                {profilePhotoUrl && typeof profilePhotoUrl === 'string' && profilePhotoUrl.trim() !== '' ? (
                                    <img 
                                        src={profilePhotoUrl} 
                                        alt="Foto de perfil" 
                                        className="profile-photo"
                                        onError={e => { e.target.onerror = null; e.target.style.display='none'; }}
                                    />
                                ) : (
                                    <div className="profile-photo-placeholder">
                                        <span>Sin foto</span>
                                    </div>
                                )}
                            </div>
                            <button 
                                className="dashboard-button"
                                onClick={() => setEditPhoto(true)}
                            >
                                {profilePhotoUrl && !profilePhotoUrl.includes('placeholder.png') ? 'Cambiar Foto' : 'Agregar Foto'}
                            </button>
                            {profilePhotoUrl && !profilePhotoUrl.includes('placeholder.png') && (
                                <button 
                                    className="dashboard-button"
                                    onClick={handlePhotoDelete}
                                    disabled={loading}
                                >
                                    Eliminar Foto
                                </button>
                            )}
                        </>
                    )}
                </section>

                <section className="dashboard-section">
                    <h4>Acerca de Mí</h4>
                    {editAbout ? (
                        <>
                            <textarea 
                                className="dashboard-textarea"
                                value={about}
                                onChange={handleAboutChange}
                                rows="4"
                                disabled={loading}
                            />
                            <button 
                                className="dashboard-button"
                                onClick={handleAboutSave} 
                                disabled={loading}
                            >
                                {loading ? 'Guardando...' : 'Guardar'}
                            </button>
                            <button 
                                className="dashboard-button"
                                onClick={() => setEditAbout(false)} 
                                disabled={loading}
                            >
                                Cancelar
                            </button>
                        </>
                    ) : (
                        <>
                            <p>{about || "Sin descripción"}</p>
                            <button 
                                className="dashboard-button"
                                onClick={() => setEditAbout(true)}
                            >
                                Editar
                            </button>
                        </>
                    )}
                </section>

                <section className="dashboard-section">
                    <h4>Mi Calificación</h4>
                    {typeof rating === 'number' && !isNaN(rating) && rating > 0 ? (
                        <p className="dashboard-rating">Calificación: {rating.toFixed(2)} ⭐</p>
                    ) : (
                        <p>Aún no has sido calificado</p>
                    )}
                </section>

                <section className="dashboard-section">
                    <h4>Mis Categorías</h4>
                    {editCategories ? (
                        <div className="category-checkboxes">
                            {allCategories.map(category => (
                                <div key={category.id}>
                                    <label>
                                        <input 
                                            type="checkbox" 
                                            value={category.id} 
                                            checked={selectedCategories.includes(category.id)}
                                            onChange={handleCategoryChange}
                                            disabled={loading}
                                        />
                                        {category.name}
                                    </label>
                                </div>
                            ))}
                            <div className="dashboard-buttons">
                                <button 
                                    className="dashboard-button"
                                    onClick={handleCategoriesSave} 
                                    disabled={loading}
                                >
                                    {loading ? 'Guardando...' : 'Guardar Categorías'}
                                </button>
                                <button 
                                    className="dashboard-button"
                                    onClick={() => setEditCategories(false)} 
                                    disabled={loading}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <ul className="dashboard-list">
                                {selectedCategories.length > 0 ? (
                                    selectedCategories.map(categoryId => {
                                        const category = allCategories.find(cat => cat.id === categoryId);
                                        return category ? <li key={category.id}>{category.name}</li> : null;
                                    })
                                ) : (
                                    <p>No tienes categorías seleccionadas</p>
                                )}
                            </ul>
                            <button 
                                className="dashboard-button"
                                onClick={() => setEditCategories(true)}
                            >
                                Editar Categorías
                            </button>
                        </>
                    )}
                </section>
            </div>
        </div>
    );
}

export default MentorDashboard;