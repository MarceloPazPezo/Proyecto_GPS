import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
//import io from "socket.io-client";
import { socket } from "../main.jsx";
import { useState } from "react";

const Quiz = () => {
    const [timer, setTimer] = useState(0);
    const [options,setOptions]=useState([]);
    
    const recieveTime=(data)=>{
        console.log(data);
        setTimer(data.time);
    }

    const finalizarQuiz=()=>{
        sessionStorage.removeItem('sala');
        navigate("/join");
    }

    const responderPreg=(data)=>{
        console.log(data);
        //socket.emit("answer",data);
    }

    const receiveOptions = (Quiz) => {
        console.log(Quiz);
        setOptions(Quiz.respuestas);
    }
    useEffect(() => {
        socket.on("opciones", receiveOptions);
        socket.on("timer",recieveTime);
        socket.on("finnish",finalizarQuiz);
    }, []);

    return (
        <div className="h-screen bg-zinc-800 text-white flex items-center justify-left">
            <div>
            <div><p className="border-2 border-zinc-500 p-2 w-auto">{timer}</p></div>
            <main className="border-2 border-zinc-500 p-2 w-auto">
                {
                    options.length>0?options.map((index,option)=>{
                        <button key={index} onClick={responderPreg}>{option.textoRespuesta}</button>
                    }):<></>
                }
            </main>
            </div>
        </div>
    )
}

export default Quiz;