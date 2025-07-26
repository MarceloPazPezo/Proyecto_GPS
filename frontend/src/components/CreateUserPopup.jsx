import React, { useState, useEffect } from 'react';
import Form from './Form';
import CloseIcon from '@assets/XIcon.svg';
import QuestionIcon from '@assets/QuestionCircleIcon.svg';
import useCreateUser from '@hooks/users/useCreateUser.jsx';
import PropTypes from 'prop-types';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';
import { createUser } from '@services/user.service.js';
import { formatUserData } from '@helpers/formatData.js';
import { getCarreras } from '@services/carrera.service.js';
export default function CreateUserPopup({ show, setShow, dataUsers }) {
    const [carreras, setCarreras] = useState([]);
    const [loadingCarreras, setLoadingCarreras] = useState(false);

    useEffect(() => {
        if (show) {
            setLoadingCarreras(true);
            getCarreras()
                .then((res) => {
                    // Si viene como { data: [...] }, usar res.data, si no, usar res
                    let carrerasArr = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []);
                    setCarreras(carrerasArr);
                })
                .catch((err) => {
                    console.error('Error obteniendo carreras:', err);
                    setCarreras([]);
                })
                .finally(() => setLoadingCarreras(false));
        }
    }, [show]);

    const {
        errorNombreCompleto,
        errorEmail,
        errorRut,
        errorPassword,
        errorData,
        handleInputChange,
    } = useCreateUser();

    const patternRut = new RegExp(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/);

    const handleSubmit = async (createdUserData) => {
        if (createdUserData) {
            try {
                const response = await createUser(createdUserData);

                if (response.status === 'Client error') {
                    errorData(response.details);
                } else {
                    const formattedUser = formatUserData(response.data);
                    showSuccessAlert('¡Registrado!', 'Usuario registrado exitosamente.');
                    setShow(false);
                    dataUsers(prevUsers => [...prevUsers, formattedUser]);
                }
            } catch (error) {
                console.error("Error al registrar un usuario: ", error);
                showErrorAlert('Cancelado', 'Ocurrió un error al registrar un usuario.');
            }
        }
    };
    return (
        <div>
            {show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="relative w-full max-w-xs sm:max-w-2xl h-auto p-0 animate-fade-in flex flex-col rounded-2xl bg-white/80 backdrop-blur-lg border border-[#4EB9FA]/20 shadow-xl">
                        {/* Header */}
                        <div className="flex items-center px-4 sm:px-10 pt-6 pb-4 border-b border-[#4EB9FA]/20 relative">
                            <h2 className="text-2xl font-bold text-[#2C3E50] flex-1">Crear usuario</h2>
                            <button
                                className="p-2 rounded-full bg-white border border-[#4EB9FA]/30 hover:bg-[#4EB9FA]/10 transition ml-2"
                                onClick={() => setShow(false)}
                                aria-label="Cerrar"
                                style={{ lineHeight: 0 }}
                            >
                                <img src={CloseIcon} alt="Cerrar" className="w-5 h-5" />
                            </button>
                        </div>
                        {/* Body con scroll interno si es necesario */}
                        <div className="px-4 sm:px-10 py-6 sm:py-10 pr-2 sm:pr-6 flex flex-col items-center flex-1 min-h-0 w-full overflow-y-auto scrollbar-thin" style={{ maxHeight: 'calc(90vh - 90px)' }}>
                            <Form
                                title={null}
                                autoComplete="off"
                                size="max-w-xs sm:max-w-2xl"
                                fields={[
                                    {
                                        label: "Nombre completo",
                                        name: "nombreCompleto",
                                        placeholder: 'Diego Alexis Salazar Jara',
                                        fieldType: 'input',
                                        type: "text",
                                        required: true,
                                        minLength: 15,
                                        maxLength: 50,
                                        pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑàèìòùÀÈÌÒÙ\s]+$/,
                                        errorMessageData: errorNombreCompleto,
                                        onChange: (e) => handleInputChange('nombreCompleto', e.target.value),
                                        autoComplete: "off"
                                    },
                                    {
                                        label: "Correo electrónico",
                                        name: "email",
                                        placeholder: 'example@gmail.cl',
                                        fieldType: 'input',
                                        type: "email",
                                        required: true,
                                        minLength: 15,
                                        maxLength: 100,
                                        errorMessageData: errorEmail,
                                        onChange: (e) => handleInputChange('email', e.target.value),
                                        autoComplete: "new-email"
                                    },
                                    {
                                        label: "Rut",
                                        name: "rut",
                                        placeholder: '21.308.770-3',
                                        fieldType: 'input',
                                        type: "text",
                                        minLength: 9,
                                        maxLength: 12,
                                        pattern: patternRut,
                                        patternMessage: "Debe ser xx.xxx.xxx-x o xxxxxxxx-x",
                                        required: true,
                                        errorMessageData: errorRut,
                                        onChange: (e) => handleInputChange('rut', e.target.value),
                                        autoComplete: "off"
                                    },
                                    {
                                        label: "Rol",
                                        name: "rol",
                                        fieldType: 'select',
                                        options: [
                                            { value: 'administrador', label: 'Administrador' },
                                            { value: 'encargado_carrera', label: 'Encargado de Carrera' },
                                            { value: 'tutor', label: 'Tutor' },
                                            { value: 'tutorado', label: 'Tutorado' },
                                            { value: 'usuario', label: 'Usuario' },
                                        ],
                                        required: true,
                                    },
                                    {
                                        label: (
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-semibold text-[#2C3E50]">Contraseña</span>
                                                <span className="relative group">
                                                    <img src={QuestionIcon} alt="info" className="w-4 h-4 cursor-pointer" />
                                                    <span className="absolute left-6 top-1 z-10 hidden group-hover:block bg-white text-xs text-[#2C3E50] border border-[#4EB9FA]/30 rounded px-2 py-1 shadow-lg min-w-max">
                                                        Este campo es opcional
                                                    </span>
                                                </span>
                                            </div>
                                        ),
                                        label: "Carrera",
                                        name: "idCarrera",
                                        fieldType: 'select',
                                        required: false,
                                        defaultValue: "",
                                        options: loadingCarreras
                                            ? [{ value: '', label: 'Cargando...' }]
                                            : carreras.length > 0
                                                ? carreras.map(c => ({ value: c.id, label: `${c.nombre} (${c.codigo})` }))
                                                : [{ value: '', label: 'No hay carreras disponibles' }],
                                        errorMessageData: null,
                                        onChange: (e) => {
                                            // Si tienes lógica de error, puedes agregarla aquí
                                        },
                                    },
                                    {
                                        label: (
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-semibold text-[#2C3E50]">Contraseña</span>
                                                <span className="relative group">
                                                    <img src={QuestionIcon} alt="info" className="w-4 h-4 cursor-pointer" />
                                                    <span className="absolute left-6 top-1 z-10 hidden group-hover:block bg-white text-xs text-[#2C3E50] border border-[#4EB9FA]/30 rounded px-2 py-1 shadow-lg min-w-max">
                                                        Este campo es obligatorio
                                                    </span>
                                                </span>
                                            </div>
                                        ),
                                        name: "password",
                                        placeholder: "**********",
                                        fieldType: 'input',
                                        type: "password",
                                        required: true,
                                        minLength: 8,
                                        maxLength: 26,
                                        pattern: /^[a-zA-Z0-9]+$/,
                                        patternMessage: "Debe contener solo letras y números",
                                        errorMessageData: errorPassword,
                                        onChange: (e) => handleInputChange('password', e.target.value),
                                        autoComplete: "new-password"
                                    }
                                ]}
                                onSubmit={handleSubmit}
                                buttonText="Crear usuario"
                                backgroundColor={'#fff'}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
CreateUserPopup.propTypes = {
    show: PropTypes.bool.isRequired,
    setShow: PropTypes.func.isRequired,
    dataUsers: PropTypes.func.isRequired,
};