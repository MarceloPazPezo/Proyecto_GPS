import Form from './Form';
import CloseIcon from '@assets/XIcon.svg';
import QuestionIcon from '@assets/QuestionCircleIcon.svg';
import useCreateCarrera from '@hooks/carreras/useCreateCarrera.jsx';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';
import { createCarrera } from '@services/carrera.service.js';
import { formatCarreraData } from '@helpers/formatData.js';
import { getEncargadosCarrera } from '@services/user.service.js';

export default function CreateCarreraPopup({ show, setShow, dataCarreras }) {
    const {
        errorNombre,
        errorCodigo,
        errorDescripcion,
        errorDepartamento,
        errorIDEncargado,
        errorData,
        handleInputChange,
    } = useCreateCarrera();

    // Estado para usuarios encargados
    const [encargados, setEncargados] = useState([]);
    const [loadingEncargados, setLoadingEncargados] = useState(false);

    useEffect(() => {
        if (show) {
            setLoadingEncargados(true);
            getEncargadosCarrera()
                .then((usuarios) => {
                    setEncargados(usuarios);
                })
                .catch(() => {
                    setEncargados([]);
                })
                .finally(() => setLoadingEncargados(false));
        }
    }, [show]);

    const handleSubmit = async (createdCarreraData) => {
        if (createdCarreraData) {
            try {
                const response = await createCarrera(createdCarreraData);

                // console.log("Carrera creada:", response.data);
                
                if (response.status === 'Client error') {
                    errorData(response.details);
                } else {
                    const formattedCarrera = formatCarreraData(response.data);
                    showSuccessAlert('¡Registrada!', 'Carrera registrada exitosamente.');
                    setShow(false);
                    dataCarreras(prevCarreras => [...prevCarreras, formattedCarrera]);
                }
            } catch (error) {
                console.error("Error al registrar una carrera: ", error);
                showErrorAlert('Cancelado', 'Ocurrió un error al registrar una carrera.');
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
                            <h2 className="text-2xl font-bold text-[#2C3E50] flex-1">Crear carrera</h2>
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
                                        label: "Nombre",
                                        name: "nombre",
                                        placeholder: '',
                                        fieldType: 'input',
                                        type: "text",
                                        required: true,
                                        minLength: 5,
                                        maxLength: 100,
                                        pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑàèìòùÀÈÌÒÙ\s]+$/,
                                        errorMessageData: errorNombre,
                                        onChange: (e) => handleInputChange('nombre', e.target.value),
                                        autoComplete: "off"
                                    },
                                    {
                                        label: "Codigo",
                                        name: "codigo",
                                        placeholder: '',
                                        fieldType: 'input',
                                        type: "text",
                                        required: true,
                                        minLength: 2,
                                        maxLength: 10,
                                        errorMessageData: errorCodigo,
                                        onChange: (e) => handleInputChange('codigo', e.target.value),
                                        autoComplete: "off"
                                    },
                                    {
                                        label: "Descripcion",
                                        name: "descripcion",
                                        placeholder: '',
                                        fieldType: 'input',
                                        type: "text",
                                        required: false,
                                        minLength: 10,
                                        maxLength: 500,
                                        errorMessageData: errorDescripcion,
                                        onChange: (e) => handleInputChange('descripcion', e.target.value),
                                        autoComplete: "off"
                                    },
                                    {
                                        label: "Departamento",
                                        name: "departamento",
                                        placeholder: '',
                                        fieldType: 'input',
                                        type: "text",
                                        required: true,
                                        minLength: 5,
                                        maxLength: 100,
                                        errorMessageData: errorDepartamento,
                                        onChange: (e) => handleInputChange('departamento', e.target.value),
                                        autoComplete: "off"
                                    },
                                    {
                                        label: "Encargado de carrera",
                                        name: "idEncargado",
                                        fieldType: 'select',
                                        required: true,
                                        options: loadingEncargados
                                            ? [{ value: '', label: 'Cargando...' }]
                                            : encargados.length > 0
                                                ? encargados.map(u => ({ value: u.id, label: `${u.nombreCompleto || 'Sin nombre'} (${u.rut})` }))
                                                : [{ value: '', label: 'No hay encargados disponibles' }],
                                        errorMessageData: errorIDEncargado,
                                        onChange: (e) => handleInputChange('idEncargado', e.target.value),
                                    }
                                ]}
                                onSubmit={handleSubmit}
                                buttonText="Crear carrera"
                                backgroundColor={'#fff'}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
CreateCarreraPopup.propTypes = {
    show: PropTypes.bool.isRequired,
    setShow: PropTypes.func.isRequired,
    dataCarreras: PropTypes.func.isRequired,
};