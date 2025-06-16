import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
//import io from "socket.io-client";
import { socket } from "../main.jsx";
import { useState } from "react";

const Quiz = () => {
    const [timer, setTimer] = useState(0);
    const [options,setOptions]=useState([]);
    const [pregunta,setPregunta]=useState('');
    
    const recieveTime=(data)=>{
        console.log(data);
        setTimer(data.time);
    }

    const receiveQuestion = (question) => {
        setOptions(question.respuestas);
        setPregunta(question.texto);
    }
    useEffect(() => {
        socket.on("question", receiveQuestion);
        socket.on("timer",recieveTime);
    }, []);

    return (
        <div className="h-screen bg-zinc-800 text-white flex items-center justify-left">
            <h1 className="border-2 border-zinc-500 p-2 w-auto">Pregunta</h1>
            <h2>{pregunta}</h2>
            <div><p className="border-2 border-zinc-500 p-2 w-auto">{timer}</p></div>
            <main className="border-2 border-zinc-500 p-2 w-auto">
                <button className="margin-right 100px">A:{options[0]}</button>
                <button>B:{options[1]}</button>
                <button>C:{options[2]}</button>
                <button>D:{options[3]}</button>
            </main>

        </div>
    )
}

export default Quiz;