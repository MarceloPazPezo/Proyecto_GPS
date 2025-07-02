import { useState ,useEffect} from "react"
import { socket } from "../main";

const pizarraIdeas = () => {

    /*
        hacer otro evento donde emita que ya se puede comenzar a escribir
    */ 
    
    const [respuesta,setRespuesta] = useState("");
    const [estado,setEstado] = useState(false);
    const [com,setCom] = useState(false)

    const responder = () => {
        socket.emit("answer",{responder:respuesta})
        setEstado(true)
    }

    useEffect(()=>
        {
                socket.on("reiniciar",(data)=>{
                setEstado(false)
                console.log("LLegue?", data)
                setCom(false)
                
            })
                socket.on("comenzar",(data)=>{
                    console.log("comienza")
                    setCom(true)
                })
        }

        
    ,[]);

return (
    <div className="container">
        {estado?
            <div>
                <h5 className="text-8xl">Has respondido con:{respuesta}</h5>
            </div>
            :
            com?<div><form onSubmit={responder} className="bg-zinc-900 p-10">
                <h1 className="text-2xl font-bold my-2 text-amber-50 ">Tu respuesta</h1>
                <input
                    name="message"
                    type="text"
                    placeholder="Escribe tu respuesta"
                    onChange={(e) => setRespuesta(e.target.value)}
                    className="border-2 border-zinc-500 p-2 w-full text-amber-50"
                    value={respuesta}
                    autoFocus
                />
            </form></div>
            :
            <div>
                Espere
            </div>}

    </div>
)
}

export default pizarraIdeas