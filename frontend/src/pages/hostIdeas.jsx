import { useState, useEffect } from "react"
import { socket } from "../main";

const hostIdeas = () => {
    let listaRespuesta = [];

    const recibirRespuestas = (data) => {
        listaRespuesta.push(data.responder);
        console.log(data.responder);
        console.log(listaRespuesta.length);
    };

    useEffect(() => {
        socket.on("answer", recibirRespuestas)
    }
        , []);

    const reiniciar = () => {
        setPreg(false)
        setMessage("")
        socket.emit("reiniciar")

        //console.log("enviado")
    }

    const [message, setMessage] = useState("");
    const [preg, setPreg] = useState(false);
    const handleSubmit = (event) => {
        event.preventDefault();
        //console.log(message);
        socket.emit("comenzar")
        setPreg(true);

    }
    return (
        <div className="container">
            {preg ? (
                <div className="flex flex-col min-h-screen px-4 pt-10">
                    <div className="flex-1 flex items-start justify-center">
                        <h5 className="text-8xl text-center">{message}</h5>
                    </div>
                    <button
                        onClick={reiniciar}
                        className="w-full max-w-xs mx-auto mb-8 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition duration-300 shadow-md"
                    >
                        🔄 Reiniciar
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="bg-zinc-900 p-10">
                    <h1 className="text-2xl font-bold my-2 text-amber-50">Pregunta</h1>
                    <input
                        name="message"
                        type="text"
                        placeholder="Escribe tu pregunta"
                        onChange={(e) => setMessage(e.target.value)}
                        className="border-2 border-zinc-500 p-2 w-full text-amber-50"
                        value={message}
                        autoFocus
                    />
                </form>
            )}
        </div>
    )
}

export default hostIdeas