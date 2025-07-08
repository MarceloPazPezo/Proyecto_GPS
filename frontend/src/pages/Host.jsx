import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { socket } from "../main";
import { useParams } from "react-router-dom";
import { getQuizByIdLote } from "../services/quiz.service";
import QuizNOptions from "../components/QuizNOptions";

const Host = () => {
    const { id: quizId } = useParams();
    const [Quiz,setQuiz]=useState([]);
    const [timer, setTimer] = useState(0);
    const [pregunta, setPregunta] = useState();
    const navigate = useNavigate();
    let index=0;
    let i = timer;
    let scores = [];
    const startTimer = async (event) => {
        event.preventDefault();
        const inter = setInterval(() => {
            if (i > 0) {
                i--;
                setTimer(i);
                socket.emit("timer", { time: i });
            }
            if (i == 0) {
                index++;
                if(index===Quiz.length){
                    setPregunta(null);
                    return;
                }
                setPregunta(Quiz[index]);
                clearInterval(inter);
            }
        }, 1000);
    }

    const enviarOpciones=()=>{
        socket.emit("opciones",pregunta.Respuestas);
    }

    const getQuiz = async () => {
        try {
            const response = await getQuizByIdLote(quizId);
            setQuiz(response.data);
            setPregunta(Quiz[index]);
            enviarOpciones();
            index++;
        } catch (error) {
            console.error(error);
        }
    }

    const finalizarAct = () => {
        socket.emit("finnish", { sala: sessionStorage.getItem('sala') });
        navigate("/room")
    }

    const setScores = () => {
        for (let j = 0; j < sessionStorage.getItem("participantes").length(); j++) {
            scores.push(0);
        }
    }

    const recieveAnswer = (data) => {

    }

    useEffect(() => {
        socket.on('answer', recieveAnswer);
        //setScores();
        //getQuiz();
    }, []);

    return (
        <div className="container">
            <main>
               
                {pregunta ?
                    <div>
                        <form onSubmit={startTimer}>
                            <h1>Timer: {timer}</h1>
                            <input
                                name="message"
                                type="number"
                                onChange={(e) => setTimer(e.target.value)}
                                className="border-2 border-zinc-500 p-2 w-full text-black"
                                value={timer}
                                autoFocus
                            />
                        </form>
                        <QuizNOptions data={pregunta} />
                    </div> : <></>
                }
                 <button onClick={getQuiz} className="center w-150 bg-white/20 border border-white/30 text-red font-bold py-3 rounded-lg mt-6 transition-all duration-200 hover:bg-white/30 hover:-translate-y-0.5">Iniciar</button>
                <button onClick={finalizarAct} className="center w-150 bg-white/20 border border-white/30 text-red font-bold py-3 rounded-lg mt-6 transition-all duration-200 hover:bg-white/30 hover:-translate-y-0.5">Terminar actividad</button>
            </main>
        </div>
    )
}
export default Host;