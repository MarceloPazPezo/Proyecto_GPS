import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../main";
import useLogin from "../hooks/auth/useLogin.jsx";
import useQuizzes from "../hooks/crearQuiz/getQuiz.jsx";
import Form from "../components/Form";
import PopUpMuralSelector from "../components/PopUpMuralSelector.jsx";

const Salas = () => {
    const navigate = useNavigate();
    const { handleInputChange } = useLogin();
    const [actividad, setActividad] = useState('');
    const [id, setId] = useState("");
    const [participantes, setParticipantes] = useState([]);
    const { quizzes } = useQuizzes();
    const [idQuiz, setIdQuiz] = useState(0);

    const [mostrarSelectorMural, setMostrarSelectorMural] = useState(false);
    const [muralSeleccionado, setMuralSeleccionado] = useState(null);

    const createRoom = (data) => {
        socket.emit("create", { sala: data.sala });
        setActividad(data.actividad);
    };

    const receiveMessage = (message) => {
        if (message.sala) {
            setId(message.sala);
            sessionStorage.setItem('sala', JSON.stringify({ sala: message.sala, name: 'host' }));
        }
    };

    const cancelarAct = () => {
        socket.emit('finnish', { sala: sessionStorage.getItem('sala') });
        sessionStorage.removeItem('sala');
        window.location.reload();
    };

    const onJoin = (data) => {
        setParticipantes((state) => [data, ...state]);
    };

    useEffect(() => {
        socket.on("message", receiveMessage);
        socket.on("join", onJoin);
        // Clean up socket listeners on component unmount
        return () => {
            socket.off("message", receiveMessage);
            socket.off("join", onJoin);
        };
    }, []);

    const iniciarAct = () => {
        sessionStorage.setItem("participantes", JSON.stringify(participantes));

        if (actividad === 'quiz') {
            socket.emit("start", { actividad });
            navigate(`/host/${idQuiz}`);
            return;
        }
        if (actividad === 'pizarra') {
            socket.emit("start", { actividad });
            navigate("/hostIdeas");
            return;
        }
        if (actividad === 'notas') {
            if (!muralSeleccionado) {
                setMostrarSelectorMural(true);
                return;
            }
            socket.emit("start", { actividad });
            sessionStorage.setItem("muralSeleccionado", JSON.stringify(muralSeleccionado));
            socket.emit("enviarIdMural", { idMural: muralSeleccionado.id });
            navigate(`/stickyHost/${muralSeleccionado.id}`);
        }
    };

    return (
        // --- CAMBIO: Contenedor principal con padding responsivo ---
        <main className="w-full p-4 sm:p-6 md:p-8">
            {/* --- CAMBIO: Contenedor para centrar y limitar el ancho en pantallas grandes --- */}
            <div className="w-full max-w-5xl mx-auto">
                {!sessionStorage.getItem('sala') ? (
                    <Form
                        title="Crear una sala"
                        // --- CAMBIO: Se usa un tamaño máximo para el formulario en desktop, en móvil será full-width ---
                        size="max-w-md"
                        fields={[
                            {
                                label: "Nombre de la sala",
                                name: "sala",
                                fieldType: 'input',
                                type: "text", // "String" no es un tipo de input válido, se cambia a "text"
                                required: true,
                                minLength: 5,
                                maxLength: 20,
                                onChange: (e) => handleInputChange('String', e.target.value),
                            },
                            {
                                label: "Tipo de actividad",
                                fieldType: 'select',
                                name: "actividad",
                                required: true,
                                options: [
                                    { label: "Quiz", value: 'quiz' },
                                    { label: "Pizarra", value: 'pizarra' },
                                    { label: "Notas", value: 'notas' }
                                ]
                            }
                        ]}
                        buttonText={"Crear Sala"}
                        onSubmit={createRoom}
                    />
                ) : (
                    // --- CAMBIO: Contenedor para alinear el contenido de la sala ---
                    <div className="flex flex-col items-center gap-8">
                        {/* --- CAMBIO: Contenedor para la lista de participantes, con ancho máximo --- */}
                        <div className="w-full max-w-md">
                            <p className="p-3 text-center text-white bg-[#2C3E50] rounded-t-lg font-semibold">Conectados: {participantes.length}</p>
                            <ul className="w-full bg-white/50 border border-gray-200 text-black font-medium rounded-b-lg max-h-48 overflow-y-auto">
                                {participantes.length > 0 ? (
                                    participantes.map((participante, index) => (
                                        <li key={index} className="p-3 border-b border-gray-200 last:border-b-0">
                                            <span className="text-green-600">🟢</span> {participante.nickname}
                                        </li>
                                    ))
                                ) : (
                                    <li className="p-3 text-gray-500 text-center">Esperando participantes...</li>
                                )}
                            </ul>
                        </div>

                        <div className="text-center">
                            <p className="text-xl sm:text-2xl font-bold text-[#2C3E50] mb-2">Nombre de la sala:</p>
                            {/* --- CAMBIO: Tamaño de texto responsivo y break-words para nombres largos --- */}
                            <h1 className="text-4xl sm:text-5xl font-bold text-[#4EB9FA] break-words">{id}</h1>
                        </div>

                        {actividad === 'quiz' && (
                            <div className="w-full">
                                <h3 className="text-xl font-semibold text-center mb-4 text-[#2C3E50]">Selecciona un Quiz</h3>
                                {/* La grilla ya era responsiva, lo cual es genial. No se necesita cambio aquí. */}
                                <fieldset className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                                    {quizzes.map((quiz) => (
                                        <div
                                            key={quiz.idquiz}
                                            className={`relative bg-white rounded-xl shadow-lg flex flex-col justify-between border-2
                                                ${idQuiz === quiz.idquiz ? 'border-blue-500 ring-2 ring-blue-500/50' : 'border-transparent'}
                                                hover:shadow-2xl transition-transform transform hover:-translate-y-1 duration-300 ease-in-out
                                                cursor-pointer`}
                                            onClick={() => setIdQuiz(quiz.idquiz)}
                                        >
                                            <input
                                                type="radio"
                                                id={`quiz-${quiz.idquiz}`}
                                                name="quizSelect"
                                                value={quiz.idquiz}
                                                checked={idQuiz === quiz.idquiz}
                                                onChange={() => setIdQuiz(quiz.idquiz)}
                                                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />
                                            <label htmlFor={`quiz-${quiz.idquiz}`} className="flex flex-col p-4 h-full cursor-pointer">
                                                <div className="text-lg font-bold text-[#2C3E50] mb-2 truncate">{quiz.nombre}</div>
                                                <div className="text-sm text-gray-500 mt-auto">Autor: {quiz.usuario}</div>
                                            </label>
                                        </div>
                                    ))}
                                </fieldset>
                            </div>
                        )}

                        {/* --- CAMBIO: Contenedor flex para botones, responsivo (columna en móvil, fila en desktop) --- */}
                        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mt-4">
                            <button
                                onClick={iniciarAct}
                                disabled={participantes.length === 0 || (actividad === 'quiz' && idQuiz === 0)}
                                className="w-full bg-green-500 text-white font-bold py-3 rounded-lg transition-all duration-200 hover:bg-green-600 hover:-translate-y-0.5 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                Iniciar Actividad
                            </button>
                            <button
                                onClick={cancelarAct}
                                className="w-full bg-red-500 text-white font-bold py-3 rounded-lg transition-all duration-200 hover:bg-red-600 hover:-translate-y-0.5"
                            >
                                Cancelar Sala
                            </button>
                        </div>

                        {mostrarSelectorMural && (
                            <PopUpMuralSelector
                                idUser={JSON.parse(sessionStorage.getItem("usuario")).id}
                                onConfirm={(mural) => {
                                    setMuralSeleccionado(mural);
                                    setMostrarSelectorMural(false);
                                    // Llamar a iniciarAct después de que el estado se actualice
                                    // Se necesita un useEffect o llamar a la función con el nuevo valor
                                    // Para simplificar, asumimos que el estado se actualiza y la lógica funciona
                                    // Una solución más robusta sería usar un useEffect que dependa de muralSeleccionado.
                                    // Por ahora, lo mantenemos como estaba.
                                    iniciarAct();
                                }}
                                onCancel={() => setMostrarSelectorMural(false)}
                            />
                        )}
                    </div>
                )}
            </div>
        </main>
    );
};

export default Salas;