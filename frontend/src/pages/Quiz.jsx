import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
//import io from "socket.io-client";
import { socket } from "../main.jsx";
import { useState } from "react";

const Quiz = () => {
    const [timer, setTimer] = useState(0);
    const [options, setOptions] = useState([{ textoRespuesta: "A",id:-1 }, { textoRespuesta: "B",id:-2 }]);

    const recieveTime = (data) => {
        //console.log(data);
        setTimer(data.time);
    }

    const finalizarQuiz = () => {
        sessionStorage.removeItem('sala');
        navigate("/join");
    }

    const responderPreg = (data) => {
        console.log(data.target.id);
        if(data.target.id>0){
            socket.emit("answer",data);
        }
    }

    const receiveOptions = (opt) => {
        console.log(opt.respuestas);
        setOptions(opt.respuestas);
    }
    useEffect(() => {
        socket.on("opt", receiveOptions);
        socket.on("timer", recieveTime);
        socket.on("finnish", finalizarQuiz);
    }, []);

    return (
        <div className="h-screen bg-zinc-800 text-white flex items-center justify-left">
            <div>
                <div>
                    <p className="border-2 border-zinc-500 p-2 w-auto">
                        {timer}
                    </p>
                </div>
                <main className="border-2 border-zinc-500 p-2 w-auto">
                    {
                        options && options.map(( option) => (
                            <div key={option.id}>
                                <button className="center w-150 bg-white/20 border border-white/30 text-black font-bold py-3 rounded-lg mt-6 transition-all duration-200 hover:bg-white/30 hover:-translate-y-0.5"
                                key={option.id} 
                                id={option.id}
                                onClick={responderPreg}>
                                    {option.textoRespuesta}
                                </button>
                            </div>

                        ))
                    }
                </main>
            </div>
        </div>
    )
}

export default Quiz;