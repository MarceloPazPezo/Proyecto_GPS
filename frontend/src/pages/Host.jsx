import { useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import { socket } from "../main";

const Host = () => {
    const navigate=useNavigate();
    const [timer, setTimer] = useState(0);
    let i=timer;
    let scores=[];
    const startTimer = async (event) => {
        event.preventDefault();
        setInterval(() => {
            if(i>0){
                i--;
                setTimer(i);
                socket.emit("timer",{time:i});
            }
        }, 1000);

    }

    const finalizarAct=()=>{
        socket.emit("finnish", { sala: sessionStorage.getItem('sala') });
        navigate("/room")
    }

    const setScores=()=>{
        for(let j=0;j<sessionStorage.getItem("participantes").length();j++){
            scores.push(0);
        }
    }

    const recieveAnswer=(data)=>{

    }

    useEffect(()=>{
        socket.on('answer',recieveAnswer);
        //setScores();
    },[]);

    return (
        <div className="container">
            <main>
                <button onClick={finalizarAct}>Terminar actividad</button>
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
            </main>
        </div>
    )
}
export default Host;