import { useState , useEffect} from "react"
import { socket } from "../main";

/*
    agergar un boton reset
*/ 
const hostIdeas = () => {
    let listaRespuesta = [];

    const recibirRespuestas = (data) => {
        listaRespuesta.push(data.respuesta);
        console.log("recibido")
    };

    useEffect(()=>
        {
            socket.on("answer",recibirRespuestas)
        }
    ,[]);

    const reiniciar = () => {
        setPreg(false)
        setMessage("")
        socket.emit("reiniciar")
        //console.log("enviado")
    }

    const [message, setMessage] = useState("");
    const [preg,setPreg]=useState(false);
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(message);
        setPreg(true);
        
    }
    return (
        <div className="container">
            {preg?
            <div>
                <h5 className="text-8xl">{message}</h5>
                <button 
                    onClick={ reiniciar }
                >
                    Reiniciar
                </button>
            </div>
            
            :<form onSubmit={handleSubmit} className="bg-zinc-900 p-10">
                <h1 className="text-2xl font-bold my-2 text-amber-50 ">Pregunta</h1>
                <input
                    name="message"
                    type="text"
                    placeholder="Escribe tu pregunta"
                    onChange={(e) => setMessage(e.target.value)}
                    className="border-2 border-zinc-500 p-2 w-full text-amber-50"
                    value={message}
                    autoFocus
                />
            </form>}
        </div>
    )
}

export default hostIdeas