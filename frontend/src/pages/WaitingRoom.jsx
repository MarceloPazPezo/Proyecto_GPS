import { useState ,useEffect} from "react"
import { socket } from "../main";
import { useNavigate } from "react-router-dom";
const WaitingRoom=()=>{
    //const[participantes,setParticipantes]=useState([]);
    const navigate=useNavigate();
    const iniciarAct = (message) => {
        if (message.actividad === 'quiz') {
            navigate("/quiz");
        }
        if (message.actividad === 'pizarra') {
            navigate("/ideas");
        }
        if (message.actividad === 'notas'){
            navigate("/notas")
        }
    }

    const cancelarAct=()=>{
        navigate('/join');
    }

    useEffect(()=>{
    socket.on('start',iniciarAct);
    socket.on('finnish',cancelarAct);
    },[])
    
    return(
        <div>
            <main className="container">
                <h1 className="text-amber-50">Espere mientras se conectan los demas participantes</h1>
            </main>
            
        </div>
    )
}

export default WaitingRoom;