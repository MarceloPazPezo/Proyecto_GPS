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
            return;
        }
    };

    return (
        <main>
            {!sessionStorage.getItem('sala') ? (
                <Form
                    title={`Crear una sala`}
                    fields={[
                        {
                            label: "Nombre de la sala",
                            name: "sala",
                            fieldType: 'input',
                            type: "String",
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
                    buttonText={"Iniciar"}
                    onSubmit={createRoom}
                />
            ) : (
                <div>
                    <p className="p-2 text-black bg-blue w-30">Conectados:</p>
                    <ul className="w-full bg-white/20 border border-white/30 text-black font-bold py-3 rounded-lg mt-6 transition-all duration-200">
                        {participantes.map((participante, index) => (
                            <li key={index}><b>{"🟢 " + participante.nickname}</b></li>
                        ))}
                    </ul>

                    <p className="text-3xl font-bold text-[#2C3E50] mb-8 text-left">Nombre de la sala:</p>
                    <h1 className="text-5xl font-bold text-[#2C3E50] mb-8 text-center">{id}</h1>

                    {actividad === 'quiz' && (
                        <div className="p-6">
                            <fieldset className="bg-white/80 backdrop-blur-lg border border-[#4EB9FA]/20 shadow-xl p-8 sm:p-10 rounded-2xl mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {quizzes.map((quiz, index) => (
                                    <div
                                        key={index}
                                        className={`relative bg-white rounded-xl shadow-lg overflow-hidden flex flex-col justify-between border
                                            ${idQuiz === quiz.idquiz ? 'border-blue-500 ring-2 ring-blue-500' : 'border-[#ECEDF2]'}
                                            hover:shadow-2xl transition-transform transform hover:-translate-y-2 duration-300 ease-in-out
                                            cursor-pointer`}
                                        onClick={() => setIdQuiz(quiz.idquiz)}
                                    >
                                        <input
                                            type="radio"
                                            id={quiz.idquiz}
                                            name="quizSelect"
                                            value={`${quiz.nombre} por: ${quiz.usuario}`}
                                            checked={idQuiz === quiz.idquiz}
                                            onChange={() => setIdQuiz(quiz.idquiz)}
                                            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        <label
                                            htmlFor={quiz.idquiz}
                                            className="flex-grow items-center justify-center p-4"
                                        >
                                            <div className="text-xl font-bold text-[#2C3E50] mb-2 truncate">
                                                {`${quiz.nombre}`}
                                            </div>
                                            <div className="text-[#4EB9FA] text-sm h-16">
                                                Autor: {`${quiz.usuario}`}
                                            </div>
                                        </label>
                                    </div>
                                ))}
                            </fieldset>
                        </div>
                    )}

                    <button
                        onClick={iniciarAct}
                        disabled={participantes.length === 0 || (actividad === 'quiz' && idQuiz === 0)}
                        className="center w-150 bg-white/20 border border-white/30 text-[#2C3E50] font-bold py-3 rounded-lg mt-6 transition-all duration-200 hover:bg-white/30 hover:-translate-y-0.5"
                    >
                        Iniciar Actividad
                    </button>
                    <button
                        onClick={cancelarAct}
                        className="w-150 bg-white/20 border border-white/30 text-[#2C3E50] font-bold py-3 rounded-lg mt-6 transition-all duration-200 hover:bg-white/30 hover:-translate-y-0.5"
                    >
                        Cancelar
                    </button>

                    {mostrarSelectorMural && (
                        <PopUpMuralSelector
                            idUser={JSON.parse(sessionStorage.getItem("usuario")).id}
                            onConfirm={(mural) => {
                                setMuralSeleccionado(mural);
                                setMostrarSelectorMural(false);
                                iniciarAct(); 
                            }}
                            onCancel={() => setMostrarSelectorMural(false)}
                        />
                    )}
                </div>
            )}
        </main>
    );
};

export default Salas;
