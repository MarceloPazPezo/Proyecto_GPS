import { deleteCarrera } from '@services/carrera.service.js';
import { deleteDataAlert, showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useDeleteCarrera = (fetchCarreras, setDataCarrera) => {
    const handleDelete = async (dataCarrera) => {
        if (dataCarrera.length > 0) {
            try {
                const result = await deleteDataAlert();
            if (result.isConfirmed) {
                const response = await deleteCarrera(dataCarrera[0].codigo);
                if(response.status === 'Client error') {
                    return showErrorAlert('Error', response.details);
                }
                showSuccessAlert('¡Eliminada!','La carrera ha sido eliminado correctamente.');
                await fetchCarreras();
                setDataCarrera([]);
            } else {
                showErrorAlert('Cancelado', 'La operación ha sido cancelada.');
            }
            } catch (error) {
                console.error('Error al eliminar la carrera:', error);
                showErrorAlert('Cancelado', 'Ocurrió un error al eliminar la carrera.');
            }
        }
    };

    return {
        handleDelete
    };
};

export default useDeleteCarrera;