
import { useState, useEffect } from 'react';
import { getMisCarreras } from '../../services/carrera.service.js';
import { formatCarreraData } from '../../helpers/formatData.js';

const useMisCarreras = () => {
    const [carreras, setCarreras] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCarreras = async () => {
        setLoading(true);
        try {
            const response = await getMisCarreras();
            const formattedData = (response.data || []).map(formatCarreraData);
            setCarreras(formattedData);
        } catch (error) {
            setCarreras([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCarreras();
    }, []);

    return { carreras, fetchCarreras, setCarreras, loading };
};

export default useMisCarreras;
