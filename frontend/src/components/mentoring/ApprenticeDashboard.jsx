import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../stylesheets/mentoring/apprenticedashboard.css';
import { AuthContext } from '../../contexts/AuthContext';
import { getApprenticeSessions, getAvailableMentors, getMentorAvailability, bookSession, rateMentor } from '../../utils/apiServices';
import placeholder from '../../img/svg/placeholder.png'

function ApprenticeDashboard() {
    const { user } = useContext(AuthContext);
    const [sessions, setSessions] = useState([]);
    const [mentors, setMentors] = useState([]);
    const [availability, setAvailability] = useState([]);
    const [selectedMentor, setSelectedMentor] = useState(null);
    const [selectedAvailability, setSelectedAvailability] = useState(null);
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [activeTab, setActiveTab] = useState('sessions');
    const [loadingBooking, setLoadingBooking] = useState(false);
    const [rating, setRating] = useState(0);
    const [ratingSessionId, setRatingSessionId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login/');
        }
    }, [user, navigate]);

    const loadSessions = useCallback(async () => {
        try {
            const data = await getApprenticeSessions(user.token);
            setSessions(Array.isArray(data.results) ? data.results : []);
        } catch (error) {
            console.error('Failed to load sessions', error);
        }
    }, [user?.token]);

    const loadMentors = useCallback(async () => {
        try {
            const data = await getAvailableMentors(user.token);
            setMentors(Array.isArray(data.results) ? data.results : []);
        } catch (error) {
            console.error('Failed to load mentors', error);
        }
    }, [user?.token]);

    const loadAvailability = useCallback(async (mentorId) => {
        try {
            const data = await getMentorAvailability(user.token, mentorId);
            const currentDate = new Date();
            const filteredAvailability = Array.isArray(data.results) 
                ? data.results.filter(slot => new Date(slot.date) >= currentDate)
                : [];
            setAvailability(filteredAvailability);
        } catch (error) {
            console.error('Failed to load availability', error);
        }
    }, [user?.token]);

    useEffect(() => {
        if (user && user.token) {
            loadSessions();
        }
    }, [user, loadSessions]);

    const handleMentorSelection = (mentorId) => {
        const mentor = mentors.find(mentor => mentor.mentor === mentorId);
        setSelectedMentor(mentor);
        setSelectedAvailability(null);
        loadAvailability(mentorId);
        setActiveTab('availability');
    };

    const handleAvailabilitySelection = (availabilityId) => {
        setSelectedAvailability(availabilityId);
        setSubject('');
        setDescription('');
        setActiveTab('details');
    };

    const handleBookSession = async () => {
        if (window.confirm("¿Estás seguro de que quieres reservar esta sesión?")) {
            setLoadingBooking(true);
            try {
                await bookSession(user.token, selectedAvailability, subject, description);
                setSelectedAvailability(null);
                setSubject('');
                setDescription('');
                loadSessions();
                setActiveTab('sessions');
            } catch (error) {
                console.error('Failed to book session', error);
            } finally {
                setLoadingBooking(false);
            }
        }
    };

    const handleBack = () => {
        if (activeTab === 'details') {
            setActiveTab('availability');
        } else if (activeTab === 'availability') {
            setActiveTab('schedule');
        }
    };

    const handleRateMentor = async (sessionId, mentorId) => {
        if (rating < 1 || rating > 5) {
            alert('Por favor ingrese una calificación entre 1 y 5.');
            return;
        }
        try {
            await rateMentor(user.token, mentorId, rating);
            alert('Calificación enviada exitosamente');
            setRating(0);
            setRatingSessionId(null);
            loadSessions();
        } catch (error) {
            console.error('Failed to rate mentor', error);
        }
    };

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
        <div className="apprentice-dashboard">
            <h2>Bienvenido, {user?.full_name}</h2>

            {activeTab === 'sessions' && (
                <div className="sessions-tab">
                    <h3>Mis sesiones</h3>
                    <div className="sessions-container">
                        <div className="session-column">
                            <h4>Sesiones Confirmadas</h4>
                            {confirmedSessions.length > 0 ? (
                                <ul>
                                    {confirmedSessions.map((session) => (
                                        <li key={session.id} className="session-item confirmed">
                                            <p><strong>{session.subject}</strong> con {session.mentor_full_name}</p>
                                            <p>{session.date} a las {session.start_time}</p>
                                            <a href={session.link} target="_blank" rel="noopener noreferrer" className="button button-secondary">
                                                Enlace a la sesión
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No tienes sesiones confirmadas</p>
                            )}
                        </div>

                        <div className="session-column">
                            <h4>Sesiones No Confirmadas</h4>
                            {unconfirmedSessions.length > 0 ? (
                                <ul>
                                    {unconfirmedSessions.map((session) => (
                                        <li key={session.id} className="session-item unconfirmed">
                                            <p><strong>{session.subject}</strong> con {session.mentor_full_name}</p>
                                            <p>{session.date} a las {session.start_time}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No tienes sesiones no confirmadas</p>
                            )}
                        </div>

                        <div className="session-column">
                            <h4>Sesiones Finalizadas</h4>
                            {completedSessions.length > 0 ? (
                                <ul>
                                    {completedSessions.map((session) => (
                                        <li key={session.id} className="session-item completed">
                                            <p><strong>{session.subject}</strong> con {session.mentor_full_name}</p>
                                            <p>{session.date} a las {session.start_time}</p>
                                            {ratingSessionId === session.id ? (
                                                <div>
                                                    <input 
                                                        type="number" 
                                                        min="1" 
                                                        max="5" 
                                                        value={rating} 
                                                        onChange={(e) => setRating(e.target.value)} 
                                                        placeholder="Calificación (1-5)"
                                                    />
                                                    <button className="button" onClick={() => handleRateMentor(session.id, session.mentor_id)}>
                                                        Enviar Calificación
                                                    </button>
                                                </div>
                                            ) : (
                                                <button className="button button-secondary" onClick={() => setRatingSessionId(session.id)}>
                                                    Calificar esta sesión
                                                </button>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No tienes sesiones finalizadas</p>
                            )}
                        </div>
                    </div>

                    <button className="button schedule-button" onClick={() => { 
                        loadMentors(); 
                        setActiveTab('schedule'); 
                    }}>
                        Agendar una sesión
                    </button>
                </div>
            )}

            {activeTab === 'schedule' && (
                <div className="schedule-tab">
                    <h3>Agendar una sesión</h3>
                    <button className="button back-button" onClick={() => setActiveTab('sessions')}>← Volver a Mis Sesiones</button>

                    <section className="mentors">
                        <h4>Seleccionar Mentor</h4>
                        {mentors.length > 0 ? (
                            <div>
                                {mentors.map((mentor) => (
                                    <div key={mentor.mentor} className="mentor-card">
                                        <img src={mentor.mentor_info.avatar || placeholder} alt={mentor.mentor_name} className="mentor-avatar" />
                                        <div className="mentor-info">
                                            <h3 className="mentor-name">{mentor.mentor_name}</h3>
                                            <p className="mentor-about">{mentor.mentor_info.about || 'Sin descripción'}</p>
                                            <div className="mentor-stats">
                                                <span>Satisfacción: {mentor.mentor_info?.rating > 0 ? `${mentor.mentor_info.rating} ⭐` : 'No calificado'}</span>
                                            </div>
                                            <p className="mentor-categories">
                                                {mentor.mentor_info?.categories.map(category => (
                                                    <span key={category.id}>{category.name}</span>
                                                ))}
                                            </p>
                                            <button className="button" onClick={() => handleMentorSelection(mentor.mentor)}>Seleccionar</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No hay mentores disponibles</p>
                        )}
                    </section>
                </div>
            )}

            {activeTab === 'availability' && (
                <div className="availability-tab">
                    <h3>Seleccionar Disponibilidad</h3>
                    <button className="button back-button" onClick={handleBack}>← Volver</button>

                    <h4>Disponibilidad para {selectedMentor?.mentor_name}</h4>

                    <section className="availability">
                        {availability.length > 0 ? (
                            <div className="availability-grid">
                                {availability.map((slot) => (
                                    <div key={slot.id} className="availability-item">
                                        <p>{slot.date}</p>
                                        <p>{slot.start_time} - {slot.end_time}</p>
                                        <button className="button" onClick={() => handleAvailabilitySelection(slot.id)}>Seleccionar</button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No hay disponibilidad para este mentor</p>
                        )}
                    </section>
                </div>
            )}

            {activeTab === 'details' && (
                <div className="details-tab">
                    <h3>Detalles de la Sesión</h3>
                    <button className="button back-button" onClick={handleBack}>← Volver</button>

                    <section className="session-details">
                        <input 
                            type="text" 
                            placeholder="Asunto" 
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            disabled={loadingBooking}
                        />
                        <textarea 
                            placeholder="Descripción"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={loadingBooking}
                        />
                        <button className="button" onClick={handleBookSession} disabled={loadingBooking}>
                            {loadingBooking ? 'Agendando...' : 'Confirmar Sesión'}
                        </button>
                    </section>
                </div>
            )}
        </div>
    );
}

export default ApprenticeDashboard;