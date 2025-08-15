import React, { useState } from 'react';
import { formsByDocument } from '../../utils/apiServices';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function FormSearcher() {
    const [documentNumber, setDocumentNumber] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const formFinder = async (e) => {
        e.preventDefault();
        setError('');

        if (!documentNumber || documentNumber.trim().length === 0) {
            setError('Este campo no puede estar vacío');
            return;
        }

        try {
            const form = await formsByDocument(documentNumber);

            Swal.fire({
                icon: 'success',
                title: 'Usuario encontrado',
            });

            navigate(`/user-completedtest/${documentNumber}`);
            console.log("Los datos son", form);
        } catch (error) {
            console.error('Error searching form by ID', error);
            setError('No se pudo encontrar el formulario. Intenta nuevamente.');
            
        }
    };

    return (
        <section className="form-searcher">
            <div className="searcher__card">
                <div>
                    <h3>FormSearcher</h3>
                    <p>Bienvenido buscador de resultados.</p>
                    <p>Esta sección te permitirá buscar los resultados de los formularios que has completado.</p>
                    <p>Utiliza el buscador para encontrar un formulario específico mediante tu ID.</p>
                </div>
                <form onSubmit={formFinder} className="search-form">
                    <input
                        type="text"
                        placeholder="Ingresa tu ID con el que completaste el formulario"
                        maxLength={10}
                        className="search__input"
                        value={documentNumber}
                        onChange={(e) => setDocumentNumber(e.target.value)}
                    />
                    <button type="submit">Buscar</button>
                </form>
                {error && <p className="error_message">{error}</p>}
            </div>
        </section>
    );
}

export default FormSearcher;
