import { useState, useEffect } from "react"
import { socket } from "../main";

const HostIdeas = () => {
    const [respuestas, setRespuestas] = useState({});
    const [message, setMessage] = useState("");
    const [preg, setPreg] = useState(false);

    const recibirRespuestas = (data) => {
        setRespuestas((prev) => {
            const nueva = { ...prev };
            const palabra = data.responder.toLowerCase(); 
            nueva[palabra] = (nueva[palabra] || 0) + 1;
            return nueva;
        });
    };

    const palabrasOrdenadas = Object.entries(respuestas)
        .sort((a, b) => b[1] - a[1]);

    useEffect(() => {
            socket.on("respuesta", recibirRespuestas);

        return () => {
            socket.off("respuesta", recibirRespuestas); 
        };
    }, []);

    const reiniciar = () => {
        setPreg(false);
        setMessage("");
        setRespuestas({});
        socket.emit("reiniciar");
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        socket.emit("comenzar");
        setPreg(true);
    };

    return (
        <div className="bg-blue-950 min-h-screen flex flex-col justify-center items-center">
            {preg ? (
                <div className="flex-1 flex flex-col px-4 pt-10">
                    <div className="mb-8">
                        <h5 className="text-4xl text-center text-white">{message}</h5>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                        <div className="relative flex justify-center items-center flex-wrap gap-4 max-w-5xl mx-auto">
                            {Object.entries(respuestas)
                                .sort((a, b) => b[1] - a[1])
                                .map(([palabra, cantidad], index) => (
                                    <span
                                        key={palabra}
                                        className="text-blue-600 font-bold text-center transition-all"
                                        style={{
                                            fontSize: `${Math.min(16 + cantidad * 10, 72)}px`,
                                            zIndex: Object.entries(respuestas).length - index,
                                        }}
                                    >
                                        {palabra}
                                    </span>
                                ))}
                        </div>
                    </div>

                    <button
                        onClick={reiniciar}
                        className="w-full max-w-xs mx-auto mb-8 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition duration-300 shadow-md"
                    >
                        🔄 Reiniciar
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="p-10 min-h-screen flex flex-col justify-center">
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
    );
}

    export default HostIdeas;