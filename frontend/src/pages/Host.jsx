import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { socket } from "../main";
import { useParams } from "react-router-dom";
import { getQuizByIdLote } from "../services/quiz.service";
import QuizNOptions from "../components/QuizNOptions";

const Host = () => {
    const { id: quizId } = useParams();
    const [timer, setTimer] = useState(3);
    const [scoreBoard, setScores] = useState([])
    const [pregunta, setPregunta] = useState();
    const [show, setShow] = useState(false)
    const navigate = useNavigate();
    let index = 0;
    let preg;
    let Qz = [];
    let intervalo = timer;
    let i = timer;

    let scores =JSON.parse(sessionStorage.getItem("participantes")).map((participante) => {
        return {
            socket: participante.socket,
            puntos: 0,
            nickname: participante.nickname
        }
    });

    const setUpActividad = async (event) => {
        event.preventDefault();
        if (!pregunta) {
            await getQuiz();
            setScores(scores);
            intervalo = timer;
        }
        enviarOpciones();
        setShow(true);
        startTimer();
    }

    const startTimer = () => {
        i = timer;
        if (timer !== 0) {
            const inter = setInterval(() => {
                if (i > 0) {
                    i--;
                    setTimer(i);
                    socket.emit("timer", { time: i });
                }
                if (i === 0) {
                    index++;
                    clearInterval(inter);
                    setPregunta(Qz.at(index));
                    setTimer(intervalo);
                    enviarOpciones();
                    setShow(false);
                    if (index >= Qz.length) {
                        console.log("fin");
                        sessionStorage.removeItem('participantes');
                        sessionStorage.removeItem('sala');
                        sessionStorage.setItem("scores",JSON.stringify(scores))
                        navigate("/scoreBoard");
                    }
                }
            }, 1000);
        }
    }

    const recieveAnswer = (data) => {
        //console.log(data);
        if (data.correcta === 'true') {
            scores.map((player) => {
                if (player.socket === data.socket) {
                    player.puntos += 10 + i;
                }
            })
        }
        //console.log(scores);
        setScores(scores);
    }

    const siguientePreg = () => {
        setTimer(intervalo)
        startTimer();
        setShow(true);
    }

    const enviarOpciones = () => {
        socket.emit("opt", { respuestas: Qz.at(index).Respuestas })
    }

    const getQuiz = async () => {
        try {
            const response = await getQuizByIdLote(quizId);
            Qz = response.data
            preg = Qz[index];
            setPregunta(preg);
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
                            <h1 className="border-2 border-zinc-500 p-2 w-full text-black">Tiempo restante: {timer}</h1>
                            {!show && <button
                                className="center w-150 bg-white/20 border border-white/30 text-black font-bold py-3 rounded-lg mt-6 transition-all duration-200 hover:bg-white/30 hover:-translate-y-0.5"
                                onClick={siguientePreg}
                            >Continuar</button>}
                        </div>
                        {show && <QuizNOptions data={pregunta} />}
                        <div>
                            <h1 className="border-2 border-zinc-500 p-2 w-full text-black">Puntuaciones</h1>
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
                        <h1 className="border-2 border-zinc-500 p-2 w-full text-black">Tiempo para cada pregunta</h1>
                        <input
                            name="message"
                            type="number"
                            onChange={(e) => setTimer(e.target.value)}
                            className="border-2 border-zinc-500 p-2 w-full text-black"
                            autoFocus
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