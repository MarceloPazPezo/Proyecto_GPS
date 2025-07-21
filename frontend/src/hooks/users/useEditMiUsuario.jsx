import { useState } from 'react';
import { updateMiUsuario } from '@services/user.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';
import { formatPostUpdate } from '@helpers/formatData.js';

const useEditMiUsuario = (setUsers) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [dataUser, setDataUser] = useState([]);
    
    const handleClickUpdate = () => {
        if (dataUser.length > 0) {
            setIsPopupOpen(true);
        }
    };

    const handleUpdate = async (updatedUserData) => {
        if (updatedUserData) {
            try {
                // Corregido: pasar id y luego los datos
                const updatedUser = await updateMiUsuario(dataUser[0].id, updatedUserData);
                showSuccessAlert('¡Actualizado!','El usuario ha sido actualizado correctamente.');
                setIsPopupOpen(false);
                const formattedUser = formatPostUpdate(updatedUser);
                setUsers(prevUsers => prevUsers.map(user => {
                    if (user.id === formattedUser.id) {
                        console.log("Reemplazando con:", formattedUser);
                    }
                    return user.email === formattedUser.email ? formattedUser : user;
                }));
                setDataUser([]);
            } catch (error) {
                console.error('Error al actualizar el usuario:', error);
                showErrorAlert('Cancelado','Ocurrió un error al actualizar el usuario.');
            }
        }
    };

    return {
        handleClickUpdate,
        handleUpdate,
        isPopupOpen,
        setIsPopupOpen,
        dataUser,
        setDataUser
    };
};

export default useEditMiUsuario;