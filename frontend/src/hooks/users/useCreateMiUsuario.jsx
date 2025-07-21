import { useState, useEffect } from 'react';
import { createMiUsuario } from '@services/user.service.js';

const useCreateMiUsuario = () => {
    const [showCreate, setShowCreate] = useState(false);

    const [errorNombreCompleto, setErrorNombreCompleto] = useState('');
    const [errorEmail, setErrorEmail] = useState('');
    const [errorRut, setErrorRut] = useState('');
    const [errorPassword, setErrorPassword] = useState('');

    const [inputData, setInputData] = useState({ email: '', rut: '', nombreCompleto: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (inputData.email) setErrorEmail('');
        if (inputData.rut) setErrorRut('');
        if (inputData.nombreCompleto) setErrorNombreCompleto('');
        if (inputData.password) setErrorPassword('');
    }, [inputData.email, inputData.rut, inputData.nombreCompleto, inputData.password]);

    const errorData = (details) => {
        if (Array.isArray(details)) {
            details.forEach(err => {
                if (err.field === 'email') setErrorEmail(err.message);
                else if (err.field === 'rut') setErrorRut(err.message);
                else if (err.field === 'nombreCompleto') setErrorNombreCompleto(err.message);
                else if (err.field === 'password') setErrorPassword(err.message);
            });
        } else if (details && typeof details === 'object' && details.field && details.message) {
            // Por si acaso viene un solo error como objeto
            if (details.field === 'email') setErrorEmail(details.message);
            else if (details.field === 'rut') setErrorRut(details.message);
            else if (details.field === 'nombreCompleto') setErrorNombreCompleto(details.message);
            else if (details.field === 'password') setErrorPassword(details.message);
        }
    };

    const handleInputChange = (field, value) => {
        setInputData(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    const handleCreate = async (userData) => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            const response = await createMiUsuario(userData);
            if (response.status === 'Success' || response.success) {
                setSuccess(true);
            } else {
                setError(response.message || 'Error al crear usuario');
                if (response.details) errorData(response.details);
            }
        } catch (err) {
            setError(err.message || 'Error al crear usuario');
        } finally {
            setLoading(false);
        }
    };

    return {
        showCreate,
        setShowCreate,
        errorNombreCompleto,
        errorEmail,
        errorRut,
        errorPassword,
        inputData,
        errorData,
        handleInputChange,
        handleCreate,
        loading,
        success,
        error
    };
};

export default useCreateMiUsuario;