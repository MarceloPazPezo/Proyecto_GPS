import { useState, useEffect } from 'react';
import { getUsers } from '@services/user.service.js';

const useUsers = () => {
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        try {
            const response = await getUsers();
            const { rut } = JSON.parse(sessionStorage.getItem('usuario')) || {};
            const formattedData = response
                .map(user => ({
                    id: user.id,
                    nombreCompleto: user.nombreCompleto,
                    rut: user.rut,
                    email: user.email,
                    rol: user.rol,
                    carreraCodigo: user.carreraCodigo || 'Sin Carrera',
                    carreraNombre: user.carreraNombre || 'Sin Código',
                    createdAt: user.createdAt
                }))
                .filter(user => cleanRut(user.rut) !== cleanRut(rut)); // Elimina el usuario autenticado normalizando el rut
            setUsers(formattedData);
        } catch (error) {
            console.error("Error: ", error);
        }
    };

    // Normaliza el rut quitando puntos y guión, y pasando a minúsculas
    function cleanRut(rut) {
        return rut ? rut.replace(/[\.-]/g, '').toLowerCase() : '';
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    // Eliminada la función dataLogged, ahora el filtrado se hace en fetchUsers

    return { users, fetchUsers, setUsers };
};

export default useUsers;