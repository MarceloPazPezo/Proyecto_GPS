import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { socket } from "../main";
import { useParams } from "react-router-dom";
import { getQuizByIdLote } from "../services/quiz.service";
import QuizNOptions from "../components/QuizNOptions";

const Host = () => {
    const { id: quizId } = useParams();
    const [Quiz, setQuiz] = useState([]);
    const [timer, setTimer] = useState(30);
    const [pregunta, setPregunta] = useState();
    const navigate = useNavigate();
    let index = 0;
    let preg;
    let Qz=[];
    let i = timer;
    let scores = [];

    const startTimer = async (event) => {
        if(!pregunta) await getQuiz();
        enviarOpciones();
        event.preventDefault();
        if (timer !== 0) {
            const inter = setInterval(() => {
                if (i > 0) {
                    i--;
                    setTimer(i);
                    socket.emit("timer", { time: i });
                }
                if (i === 0) {
                    index++;
                    siguientePreg();
                    clearInterval(inter);
                }
            }, 1000);
        }
    }

    const siguientePreg=()=>{
        setPregunta(Qz[index]);
        enviarOpciones();
    }

    const enviarOpciones = () => {
        socket.emit("opt", { respuestas:Qz[index].Respuestas})
        console.log(Qz[index].Respuestas)
    }

    const getQuiz = async () => {
        try {
            const response = await getQuizByIdLote(quizId);
            Qz=response.data
            preg=Qz[index];
            setQuiz(Qz);
            setPregunta(preg);
        } catch (error) {
            console.error(error);
        }
    }

    const finalizarAct = () => {
        socket.emit("finnish", { sala: sessionStorage.getItem('sala') });
        navigate("/room")
    }

    useEffect(() => {
        //socket.on('answer', recieveAnswer);
    }, []);

    return (
        <div className="container">
            <main>
                {pregunta ?
                    <div>
                        <div>
                            <h1 className="border-2 border-zinc-500 p-2 w-full text-black">Tiempo restante: {timer}</h1>
                        </div>
                        <QuizNOptions data={pregunta} />
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
                        <button onClick={startTimer} className="center w-150 bg-white/20 border border-white/30 text-black font-bold py-3 rounded-lg mt-6 transition-all duration-200 hover:bg-white/30 hover:-translate-y-0.5">Iniciar</button>
                    </div>
                }
                <button onClick={finalizarAct} className="center w-150 bg-white/20 border border-white/30 text-black font-bold py-3 rounded-lg mt-6 transition-all duration-200 hover:bg-white/30 hover:-translate-y-0.5">Terminar actividad</button>
            </main>
        </div>
    )
}
export default Host;