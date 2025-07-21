import { useState, useEffect } from 'react';
import { getCarreras } from '@services/carrera.service.js';

const useCarreras = () => {
    const [carreras, setCarreras] = useState([]);

    const fetchCarreras = async () => {
        try {
            const response = await getCarreras();
            const formattedData = response.map(carrera => ({
                id:carrera.id,
                nombre: carrera.nombre,
                codigo: carrera.codigo,
                descripcion: carrera.descripcion,
                departamento: carrera.departamento,
                rutEncargado: carrera.rutEncargado,
                createdAt: carrera.createdAt
            }));
            dataLogged(formattedData);
            setCarreras(formattedData);
        } catch (error) {
            console.error("Error: ", error);
        }
    };

    useEffect(() => {
        fetchCarreras();
    }, []);

    const dataLogged = (formattedData) => {
        try {
            const { rut } = JSON.parse(sessionStorage.getItem('usuario'));
            for(let i = 0; i < formattedData.length ; i++) {
                if(formattedData[i].rut === rut) {
                    formattedData.splice(i, 1);
                    break;
                }
            }
        } catch (error) {
            console.error("Error: ", error)
        }
    };

    return { carreras, fetchCarreras, setCarreras };
};

export default useCarreras;