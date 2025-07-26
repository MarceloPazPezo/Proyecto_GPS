
import React, { useState, useEffect } from 'react';
import Form from './Form';
import CloseIcon from '@assets/XIcon.svg';
import QuestionIcon from '@assets/QuestionCircleIcon.svg';
import { getCarreras } from '../services/carrera.service';
export default function UpdateUserPopup({ show, setShow, data, action }) {
    const userData = data && data.length > 0 ? data[0] : {};

    console.log("Datos del usuario a editar:", userData);
    // Mapeo de nombres legibles a valores de BD
    const rolMap = {
        'Administrador': 'administrador',
        'Encargado Carrera': 'encargado_carrera',
        'Encargado de Carrera': 'encargado_carrera',
        'Tutor': 'tutor',
        'Tutorado': 'tutorado',
        'Usuario': 'usuario',
        'administrador': 'administrador',
        'encargado_carrera': 'encargado_carrera',
        'tutor': 'tutor',
        'tutorado': 'tutorado',
        'usuario': 'usuario',
    };
    const rolValue = rolMap[userData.rol] || "";

    // Estado para carreras gestionadas
    const [carreras, setCarreras] = React.useState([]);
    const [loadingCarreras, setLoadingCarreras] = React.useState(false);

    React.useEffect(() => {
        if (show) {
            setLoadingCarreras(true);
            getCarreras()
                .then((res) => {
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

    const handleSubmit = (formData) => {
        action(formData);
    };

    const patternRut = new RegExp(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/);

    return (
        <div>
            {show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="relative w-full max-w-xs sm:max-w-2xl h-auto p-0 animate-fade-in flex flex-col rounded-2xl bg-white/80 backdrop-blur-lg border border-[#4EB9FA]/20 shadow-xl">
                        {/* Header */}
                        <div className="flex items-center px-4 sm:px-10 pt-6 pb-4 border-b border-[#4EB9FA]/20 relative">
                            <h2 className="text-2xl font-bold text-[#2C3E50] flex-1">Editar usuario</h2>
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
                                        defaultValue: userData.nombreCompleto || "",
                                        placeholder: 'Diego Alexis Salazar Jara',
                                        fieldType: 'input',
                                        type: "text",
                                        required: true,
                                        minLength: 15,
                                        maxLength: 50,
                                        pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑàèìòùÀÈÌÒÙ\s]+$/,
                                        // errorMessageData: errorNombreCompleto, // Si tienes lógica de error, descomenta y pásala por props
                                        autoComplete: "off"
                                    },
                                    {
                                        label: "Correo electrónico",
                                        name: "email",
                                        defaultValue: userData.email || "",
                                        placeholder: 'example@gmail.cl',
                                        fieldType: 'input',
                                        type: "email",
                                        required: true,
                                        minLength: 15,
                                        maxLength: 100,
                                        // errorMessageData: errorEmail,
                                        autoComplete: "new-email"
                                    },
                                    {
                                        label: "Rut",
                                        name: "rut",
                                        defaultValue: userData.rut || "",
                                        placeholder: '21.308.770-3',
                                        fieldType: 'input',
                                        type: "text",
                                        minLength: 9,
                                        maxLength: 12,
                                        pattern: patternRut,
                                        patternMessage: "Debe ser xx.xxx.xxx-x o xxxxxxxx-x",
                                        required: true,
                                        // errorMessageData: errorRut,
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
                                        defaultValue: rolValue,
                                    },
                                    {
                                        label: (
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-semibold text-[#2C3E50]">Carrera</span>
                                                <span className="relative group">
                                                    <img src={QuestionIcon} alt="info" className="w-4 h-4 cursor-pointer" />
                                                    <span className="absolute left-6 top-1 z-10 hidden group-hover:block bg-white text-xs text-[#2C3E50] border border-[#4EB9FA]/30 rounded px-2 py-1 shadow-lg min-w-max">
                                                        Este campo es opcional
                                                    </span>
                                                </span>
                                            </div>
                                        ),
                                        name: "idCarrera",
                                        fieldType: 'select',
                                        required: false,
                                        defaultValue: userData.idCarrera?.id || userData.idCarrera || "",
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
                                                <span className="font-semibold text-[#2C3E50]">Nueva contraseña</span>
                                                <span className="relative group">
                                                    <img src={QuestionIcon} alt="info" className="w-4 h-4 cursor-pointer" />
                                                    <span className="absolute left-6 top-1 z-10 hidden group-hover:block bg-white text-xs text-[#2C3E50] border border-[#4EB9FA]/30 rounded px-2 py-1 shadow-lg min-w-max">
                                                        Este campo es opcional
                                                    </span>
                                                </span>
                                            </div>
                                        ),
                                        name: "newPassword",
                                        placeholder: "**********",
                                        fieldType: 'input',
                                        type: "password",
                                        required: false,
                                        minLength: 8,
                                        maxLength: 26,
                                        pattern: /^[a-zA-Z0-9]+$/,
                                        patternMessage: "Debe contener solo letras y números",
                                        // errorMessageData: errorPassword,
                                        autoComplete: "new-password"
                                    }
                                ]}
                                onSubmit={handleSubmit}
                                buttonText="Editar usuario"
                                backgroundColor={'#fff'}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}