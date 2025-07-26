import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { socket } from "../main";
import { getQuizByIdLote } from "../services/quiz.service";
import fondoSVG from '../assets/fondo_azul.svg';
import { createDefaultAnswers, createExtraAnswers } from '../helpers/quizHelpers.js';

// Plantillas de respuesta para mostrar en la pantalla del host
const answerTemplates = [...createDefaultAnswers(), ...createExtraAnswers()];

let Qz = [];
let intervalo = 0;
let scores = [];
let index = 0;
let i = 0;

const Host = () => {
    const { id: quizId } = useParams();
    const [timer, setTimer] = useState(10);
    const [scoreBoard, setScores] = useState([]);
    const [pregunta, setPregunta] = useState(null);
    const [showOptions, setShowOptions] = useState(false);
    const [playersAnswered, setPlayersAnswered] = useState(0);
    const navigate = useNavigate();

    const setUpActividad = async () => {
        if (!pregunta) {
            await getQuiz();
            scores = JSON.parse(sessionStorage.getItem("participantes")).map((participante) => ({
                socket: participante.socket,
                puntos: 0,
                nickname: participante.nickname,
            }));
            setScores(scores);
            intervalo = parseInt(timer, 10);
        }
        enviarOpciones();
        setShowOptions(true);
        startTimer();
    };

    const startTimer = () => {
        setTimer(intervalo);
        i = intervalo;
        setPlayersAnswered(0);
        const inter = setInterval(() => {
            if (i > 0) {
                i--;
                setTimer(i);
                socket.emit("timer", { time: i });
            } else {
                clearInterval(inter);
                setShowOptions(false);
            }
        }, 1000);
    };

    const recieveAnswer = (data) => {
        setPlayersAnswered(prev => prev + 1); 
        if (showOptions && data.correcta === 'true') {
            const newScores = scores.map((player) => {
                if (player.socket === data.socket) {
                    return { ...player, puntos: player.puntos + 10 + timer };
                }
                return player;
            });
            scores = newScores;
            setScores(newScores);
        }
    };

    const siguientePreg = () => {
        index++;
        if (index >= Qz.length) {
            sessionStorage.removeItem('participantes');
            sessionStorage.removeItem('sala');
            sessionStorage.setItem("scores", JSON.stringify(scores));
            navigate("/scoreBoard");
        } else {
            setPregunta(Qz[index]);
            enviarOpciones();
            startTimer();
            setShowOptions(true);
        }
    };

    const enviarOpciones = () => {
        if (Qz[index]) {
            socket.emit("opt", { respuestas: Qz[index].Respuestas });
        }
    };

    const getQuiz = async () => {
        try {
            const response = await getQuizByIdLote(quizId);
            Qz = response.data;
            setPregunta(Qz[index]);
        } catch (error) {
            console.error(error);
        }
    };

    const finalizarAct = () => {
        socket.emit("finnish", { sala: sessionStorage.getItem('sala') });
        sessionStorage.removeItem("sala");
        sessionStorage.removeItem("participantes");
        navigate("/room");
    };

    useEffect(() => {
        socket.on('answer', recieveAnswer);
        return () => {
            socket.off('answer', recieveAnswer);
        };
    }, [showOptions, timer]);

    const sortedScores = [...scoreBoard].sort((a, b) => b.puntos - a.puntos);

    return (
        <div className="min-h-screen text-white flex flex-col items-center justify-between p-9"
            style={{ backgroundImage: `url(${fondoSVG})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>

            <header className="w-full max-w-5xl mx-auto flex flex-col items-center gap-4">
                {pregunta && (
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 text-gray-800 font-bold text-3xl text-center flex-grow w-full min-h-[150px] flex items-center justify-center shadow-lg">
                        <p>{pregunta.texto}</p>
                    </div>
                )}
                <div className="w-full flex justify-between items-center mt-4">
                    <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3 font-bold text-3xl text-center min-w-[80px]">
                        <span>{timer}</span>
                    </div>
                    {showOptions && pregunta && (
                        <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3 font-bold text-xl">
                            <span>Participantes: {playersAnswered} / {scores.length}</span>
                        </div>
                    )}
                </div>
            </header>

            <main className="w-full max-w-5xl p-4 flex-grow flex flex-col items-center justify-center">
                {!pregunta ? (
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">Tiempo para cada pregunta</h1>
                        <input
                            type="number"
                            onChange={(e) => setTimer(e.target.value)}
                            className="w-full max-w-xs text-center text-black bg-white/80 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                            min={5}
                            value={timer}
                        />
                        <button onClick={setUpActividad}
                            disabled={timer<5||timer===null}
                            className="w-full max-w-xs mt-6 bg-green-500 border-2 border-green-700 text-white font-bold py-3 rounded-lg transition-all duration-200 hover:bg-green-600 hover:-translate-y-0.5 shadow-md">
                            Iniciar Actividad
                        </button>
                    </div>
                ) : (
                    <>
                        {showOptions ? (
                            pregunta.imagenUrl ? (
                                // Layout con imagen: izquierda imagen, derecha alternativas
                                <div className="flex w-full h-full gap-6">
                                    {/* Mitad izquierda - Imagen */}
                                    <div className="w-1/2 flex items-center justify-center">
                                        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-full max-h-full flex items-center justify-center">
                                            <img 
                                                src={pregunta.imagenUrl} 
                                                alt="Pregunta" 
                                                className="max-w-full max-h-full object-contain rounded-lg"
                                                style={{ maxHeight: '400px' }}
                                            />
                                        </div>
                                    </div>
                                    
                                    {/* Mitad derecha - Alternativas */}
                                    <div className="w-1/2 flex flex-col justify-center gap-3">
                                        {pregunta.Respuestas.map((option, index) => {
                                            const template = answerTemplates[index];
                                            return (
                                                <div key={option.id}
                                                    className={`flex items-center w-full p-4 rounded-lg text-white font-bold text-lg shadow-lg ${template.color}`}>
                                                    <div className="flex items-center justify-center w-10 h-10 mr-3 text-white">
                                                        <template.Icon size={24} />
                                                    </div>
                                                    <span className="flex-grow text-center">{option.textoRespuesta}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                // Layout sin imagen: grid normal centrado
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
                                    {pregunta.Respuestas.map((option, index) => {
                                        const template = answerTemplates[index];
                                        return (
                                            <div key={option.id}
                                                className={`flex items-center w-full p-6 rounded-lg text-white font-bold text-2xl shadow-lg ${template.color}`}>
                                                <div className="flex items-center justify-center w-12 h-12 mr-4 text-white">
                                                    <template.Icon size={30} />
                                                </div>
                                                <span className="flex-grow text-center">{option.textoRespuesta}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )
                        ) : (
                            <div className="flex flex-col items-center justify-center w-full">
                                <h2 className="text-3xl font-bold mb-6">Puntuaciones</h2>
                                <div className="w-full max-w-xl bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                                    <div className="grid grid-cols-[1fr_auto] gap-2 font-bold text-xl mb-2">
                                        <div className="text-left">Jugador</div>
                                        <div className="text-right">Puntos</div>
                                    </div>
                                    <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                        {sortedScores.map((score) => (
                                            <li key={score.socket} className="flex justify-between items-center bg-white/20 p-3 rounded-md">
                                                <span className="text-lg">{score.nickname}</span>
                                                <span className="text-lg font-mono">{score.puntos}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <button onClick={siguientePreg}
                                    className="w-full max-w-sm mt-8 bg-blue-500 border-2 border-blue-700 text-white font-bold py-3 rounded-lg transition-all duration-200 hover:bg-blue-600 hover:-translate-y-0.5 shadow-md">
                                    {index + 1 >= Qz.length ? "Ver Resultados Finales" : "Siguiente Pregunta"}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>

            <footer className="w-full max-w-5xl mt-8">
                <button onClick={finalizarAct}
                    className="w-full bg-red-500 border-2 border-red-700 text-white font-bold py-3 rounded-lg transition-all duration-200 hover:bg-red-600 hover:-translate-y-0.5 shadow-md">
                    Terminar Actividad
                </button>
            </footer>
        </div>
    );
};

export default Host;