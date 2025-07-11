import { socket } from "../main";
import { useState, useEffect, act } from "react";
import { useNavigate } from "react-router-dom";
import useLogin from "../hooks/auth/useLogin.jsx";
import Form from "../components/Form";
import useQuizzes from "../hooks/crearQuiz/getQuiz.jsx";



const Salas = () => {
    const navigate = useNavigate();
    const { handleInputChange } = useLogin();
    const [actividad, setActividad] = useState('');
    const [id, setId] = useState("");
    const [participantes, setParticipantes] = useState([]);

    const { quizzes } = useQuizzes();
    const [idQuiz, setIdQuiz] = useState(0);


    const createRoom = (data) => {
        socket.emit("create", { sala: data.sala });
        setActividad(data.actividad);
    }

    const receiveMessage = (message) => {
        if (message.sala) {
            setId(message.sala);
            sessionStorage.setItem('sala', JSON.stringify({ sala: message.sala, name: 'host' }));
        }
        //console.log(sessionStorage.getItem('sala'));
    }

    const cancelarAct = () => {
        socket.emit('finnish', { sala: sessionStorage.getItem('sala') })
        sessionStorage.removeItem('sala');
        window.location.reload();
    }

    const onJoin = (data) => {
        //console.log(data);
        setParticipantes((state) => [data, ...state]);
    }

    useEffect(() => {
        socket.on("message", receiveMessage);
        socket.on("join", onJoin);
    }, []);

    const iniciarAct = () => {

        sessionStorage.setItem("participantes", participantes);
        socket.emit("start", { actividad: actividad });
        if (actividad === 'quiz') navigate(`/host/${idQuiz}`);
        if (actividad === 'pizarra') navigate("/hostIdeas");
        if (actividad === 'notas') navigate("/stickyHost");

    }



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
                    <p className="p-2 text-white bg-black w-30">Conectados:</p>
                    <ul className="w-full bg-white/20 border border-white/30 text-white font-bold py-3 rounded-lg mt-6 transition-all duration-200">
                        {participantes.map((participante, index) => (
                            <li key={index}><b>{"🟢 " + participante.nickname}</b></li>
                        ))}
                    </ul>

                    <p className="text-3xl font-bold text-white mb-8 text-left">Nombre de la sala:</p>
                    <h1 className="text-5xl font-bold text-white mb-8 text-center">{id}</h1>

                    {actividad === 'quiz' && (
                        <div>
                            <ul>
                                {quizzes.map((quiz, index) => (
                                    <div key={index}>
                                        <input
                                            type="radio"
                                            onClick={(e) => setIdQuiz(e.target.id)}
                                            id={quiz.idquiz}
                                            readOnly
                                            name="quizSelect"
                                            value={`'${quiz.nombre}' por: ${quiz.usuario}`}
                                            className="center w-150 bg-white/20 border border-white/30 text-white font-bold py-3 rounded-lg mt-6 transition-all duration-200 hover:bg-white/30 hover:-translate-y-0.5"
                                        />
                                    </div>
                                ))}
                            </ul>
                        </div>
                    )}

                    <button
                        onClick={iniciarAct}
                        disabled={participantes.length === 0 || (actividad === 'quiz' && idQuiz === 0)}
                        className="center w-150 bg-white/20 border border-white/30 text-white font-bold py-3 rounded-lg mt-6 transition-all duration-200 hover:bg-white/30 hover:-translate-y-0.5"
                    >
                        Iniciar Actividad
                    </button>
                    <button
                        onClick={cancelarAct}
                        className="w-150 bg-white/20 border border-white/30 text-white font-bold py-3 rounded-lg mt-6 transition-all duration-200 hover:bg-white/30 hover:-translate-y-0.5"
                    >
                        Cancelar
                    </button>
                </div>
            )}
        </main>
    )
}

export default Salas;