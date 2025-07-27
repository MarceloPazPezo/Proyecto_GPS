import { useState } from 'react';
import { updateCarrera } from '@services/carrera.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';
import { formatPostUpdateCarreraData } from '@helpers/formatData.js';

const useEditCarrera = (setCarreras) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [dataCarrera, setDataCarrera] = useState([]);
    
    const handleClickUpdate = () => {
        if (dataCarrera.length > 0) {
            setIsPopupOpen(true);
        }
    };

    const handleUpdate = async (updatedCarreraData) => {
        if (updatedCarreraData) {
            try {
            const updatedCarrera = await updateCarrera(updatedCarreraData, dataCarrera[0].codigo);
            showSuccessAlert('¡Actualizada!','La carrera ha sido actualizado correctamente.');
            setIsPopupOpen(false);
            const formattedCarrera = formatPostUpdateCarreraData(updatedCarrera);

            setCarreras(prevCarreras => prevCarreras.map(carrera => {
                console.log("Carrera actual:", carrera);
                if (carrera.id === formattedCarrera.id) {
                    console.log("Reemplazando con:", formattedCarrera);
                }
                return carrera.codigo === formattedCarrera.codigo ? formattedCarrera : carrera;
            }));
            

            setDataCarrera([]);
            } catch (error) {
                console.error('Error al actualizar la carrera:', error);
                showErrorAlert('Cancelado','Ocurrió un error al actualizar la carrera.');
            }
        }
    };

    return {
        handleClickUpdate,
        handleUpdate,
        isPopupOpen,
        setIsPopupOpen,
        dataCarrera,
        setDataCarrera
    };
};

export default useEditCarrera;