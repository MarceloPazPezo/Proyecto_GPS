import { useState, useEffect } from 'react';
import { createCarrera } from '@services/carrera.service.js';

const useCreateCarrera = () => {
    const [showCreate, setShowCreate] = useState(false);

    const [errorNombre, setErrorNombre] = useState('');
    const [errorCodigo, setErrorCodigo] = useState('');
    const [errorDescripcion, setErrorDescripcion] = useState('');
    const [errorDepartamento, setErrorDepartamento] = useState('');
    const [errorIDEncargado, setErrorIDEncargado] = useState('');

    const [inputData, setInputData] = useState({ nombre: '', codigo: '', descripcion: '', departamento: '', idEncargado: '' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (inputData.nombre) setErrorNombre('');
        if (inputData.codigo) setErrorCodigo('');
        if (inputData.descripcion) setErrorDescripcion('');
        if (inputData.departamento) setErrorDepartamento('');
        if (inputData.idEncargado) setErrorIDEncargado('');
    }, [inputData.nombre, inputData.codigo, inputData.descripcion, inputData.departamento, inputData.idEncargado]);

    const errorData = (details) => {
        if (Array.isArray(details)) {
            details.forEach(err => {
                if (err.field === 'nombre') setErrorNombre(err.message);
                else if (err.field === 'codigo') setErrorCodigo(err.message);
                else if (err.field === 'descripcion') setErrorDescripcion(err.message);
                else if (err.field === 'departamento') setErrorDepartamento(err.message);
                else if (err.field === 'idEncargado') setErrorIDEncargado(err.message);
            });
        } else if (details && typeof details === 'object' && details.field && details.message) {
            // Por si acaso viene un solo error como objeto
            if (details.field === 'nombre') setErrorEmail(details.message);
            else if (details.field === 'codigo') setErrorCodigo(err.message);
            else if (details.field === 'descripcion') setErrorDescripcion(err.message);
            else if (details.field === 'departamento') setErrorDepartamento(err.message);
            else if (details.field === 'idEncargado') setErrorIDEncargado(err.message);
        }
    };

    const handleInputChange = (field, value) => {
        setInputData(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    const handleCreate = async (carreraData) => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            const response = await createCarrera(carreraData);
            if (response.status === 'Success' || response.success) {
                setSuccess(true);
            } else {
                setError(response.message || 'Error al crear carrera');
                if (response.details) errorData(response.details);
            }
        } catch (err) {
            setError(err.message || 'Error al crear carrera');
        } finally {
            setLoading(false);
        }
    };

    return {
        showCreate,
        setShowCreate,
        errorNombre,
        errorCodigo,
        errorDescripcion,
        errorDepartamento,
        errorIDEncargado,
        inputData,
        errorData,
        handleInputChange,
        handleCreate,
        loading,
        success,
        error
    };
};

export default useCreateCarrera;