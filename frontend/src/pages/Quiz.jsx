import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
//import io from "socket.io-client";
import { socket } from "../main.jsx";
import { useState } from "react";
import { useParams } from "react-router-dom";

const Quiz = () => {
    const [timer, setTimer] = useState(0);
    const [options,setOptions]=useState([]);
    const [pregunta,setPregunta]=useState('');
    
    const recieveTime=(data)=>{
        console.log(data);
        setTimer(data.time);
    }

    const finalizarQuiz=()=>{
        sessionStorage.removeItem('sala');
        navigate("/join");
    }

    const responderPreg=(data)=>{
        socket.emit("answer",data);
    }

    const receiveQuestion = (question) => {
        setOptions(question.respuestas);
        setPregunta(question.texto);
    }
    useEffect(() => {
        socket.on("question", receiveQuestion);
        socket.on("timer",recieveTime);
        socket.on("finnish",finalizarQuiz);
    }, []);

    return (
        <div className="h-screen bg-zinc-800 text-white flex items-center justify-left">
            {pregunta.length===0?<h2 className="border-2 border-zinc-500 p-2 w-auto">Esperando pregunta</h2>
            :<div>
            <h2 className="border-2 border-zinc-500 p-2 w-auto">{pregunta}</h2>
            <div><p className="border-2 border-zinc-500 p-2 w-auto">{timer}</p></div>
            <main className="border-2 border-zinc-500 p-2 w-auto">
                {
                    options.length>0?options.map((index,option)=>{
                        <button key={index} onClick={responderPreg}>{option.text}</button>
                    }):<></>
                }
            </main>
            </div>}
        </div>
    )
}

export default Quiz;