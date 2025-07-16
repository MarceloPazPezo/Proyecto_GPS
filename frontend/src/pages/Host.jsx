import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { socket } from "../main";
import { useParams } from "react-router-dom";
import { getQuizByIdLote } from "../services/quiz.service";
import QuizNOptions from "../components/QuizNOptions";

let Qz = [];
let intervalo = 0;
let scores =[]
let index = 0;
let i = 0;
const Host = () => {
    const { id: quizId } = useParams();
    const [timer, setTimer] = useState(5);
    const [scoreBoard, setScores] = useState([]);
    const [pregunta, setPregunta] = useState();
    const [show, setShow] = useState(false)
    const navigate = useNavigate();

    const setUpActividad = async () => {
        if (!pregunta) {
            await getQuiz();
            setScores(scores);
            intervalo = timer;
        }
        scores=JSON.parse(sessionStorage.getItem("participantes")).map((participante) => {
        return {
            socket: participante.socket,
            puntos: 0,
            nickname: participante.nickname
        }
    });
        enviarOpciones();
        setShow(true);
        startTimer();
    }

    const startTimer = () => {
        setTimer(intervalo);
        i = intervalo;
        const inter = setInterval(() => {
            if (i > 0) {
                i--;
                setTimer(i);
                socket.emit("timer", { time: i });
            }
            if (i == 0) {
                clearInterval(inter);
                setShow(false);
            }
        }, 1000);
    }

    const recieveAnswer = (data) => {
        if (data.correcta === 'true') {
            scores.map((player) => {
                if (player.socket === data.socket) {
                    player.puntos += 10 + timer;
                }
            })
        }
        setScores(scores);
    }

    const siguientePreg = () => {
        index++;
        if (index >= Qz.length) {
            sessionStorage.removeItem('participantes');
            sessionStorage.removeItem('sala');
            sessionStorage.setItem("scores", JSON.stringify(scores))
            navigate("/scoreBoard");
        } else {
            setPregunta(Qz[index])
            enviarOpciones();
            startTimer();
            setShow(true);
        }
    }

    const enviarOpciones = () => {
        socket.emit("opt", { respuestas: Qz.at(index).Respuestas })
    }

    const getQuiz = async () => {
        try {
            const response = await getQuizByIdLote(quizId);
            Qz = response.data
            setPregunta(Qz[index]);
        } catch (error) {
            console.error(error);
        }
    }

    const finalizarAct = () => {
        socket.emit("finnish", { sala: sessionStorage.getItem('sala') });
        sessionStorage.removeItem("sala");
        sessionStorage.removeItem("participantes");
        navigate("/room")
    }

    useEffect(() => {
        socket.on('answer', recieveAnswer);
    }, []);

    return (
        <div className="container">
            <main>
                {pregunta ?
                    <div>
                        <div>
                            <h1 className=" text-black">Tiempo restante: {timer}</h1>
                            {!show &&
                                <button
                                    className="center w-150 bg-white/20 border border-white/30 text-black font-bold py-3 rounded-lg mt-6 transition-all duration-200 hover:bg-white/30 hover:-translate-y-0.5"
                                    onClick={siguientePreg}
                                >Continuar
                                </button>}
                        </div>
                        {show && <QuizNOptions data={pregunta} />}
                        <div>
                            <h1 className=" p-2 w-full text-black">Puntuaciones</h1>
                            {!show && scoreBoard.map((score) => (
                                <div key={score.socket}>
                                    <h1 key={score.socket}
                                        className="border-2 border-zinc-500 p-2 w-full text-black"
                                    >
                                        {score.nickname}:{score.puntos}
                                    </h1>
                                </div>
                            ))}
                        </div>
                    </div> :
                    <div>
                        <h1 className=" text-black">Tiempo para cada pregunta</h1>
                        <input
                            type="number"
                            onChange={(e) => setTimer(e.target.value)}
                            className="w-2xl items-center text-black"
                            autoFocus
                            min={5}
                            value={timer}
                        />
                        <button onClick={setUpActividad}
                            className="center w-150 bg-white/20 border border-white/30 text-black font-bold py-3 rounded-lg mt-6 transition-all duration-200 hover:bg-white/30 hover:-translate-y-0.5">
                            Iniciar</button>
                    </div>
                }
                <button onClick={finalizarAct} className="center w-150 bg-white/20 border border-white/30 text-black font-bold py-3 rounded-lg mt-6 transition-all duration-200 hover:bg-white/30 hover:-translate-y-0.5">Terminar actividad</button>
            </main>
        </div>
    )
}
export default Host;