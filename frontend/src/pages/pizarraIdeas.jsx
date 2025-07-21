import { useState, useEffect } from "react"
import { socket } from "../main";
import "../styles/index.css"

const pizarraIdeas = () => {

    const [respuesta, setRespuesta] = useState("");
    const [estado, setEstado] = useState(false);
    const [com, setCom] = useState(false)

    const responder = () => {
        socket.emit("respuesta", { responder: respuesta })
        setEstado(true)
    }

    useEffect(() => {
        socket.on("reiniciar", (data) => {
            setEstado(false)
            //console.log("LLegue?", data)
            setCom(false)

        })
        socket.on("comenzar", (data) => {
            //console.log("comienza")
            setCom(true)
        })
    }


        , []);

    return (
        <div className="bg-blue-950 min-h-screen flex flex-col justify-center items-center">
            {estado ?
                <div className="relative flex-1 flex flex-col">
                    <div className="w-full py-8">
                        <h5 className="text-4xl text-center">Has respondido con:</h5>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                        <h3 className="text-8xl text-center">{respuesta}</h3>
                    </div>
                </div>
                :
                com ? <div><form onSubmit={responder} className="bg-zinc-900 p-10">
                    <h1 className="text-2xl font-bold my-2 text-amber-50">Tu respuesta</h1>
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
                    <div className="min-h-screen flex flex-col justify-center items-center">
                        <h1 className="text-2xl font-bold my-2 text-amber-50 animate-dots">Por favor espere</h1>
                    </div>}

        </div>
    )
}

export default pizarraIdeas