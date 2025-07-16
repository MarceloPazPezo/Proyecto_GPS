const QuizNOptions = ({data}) => {
    return (
        <div className=" bg-gray-100 font-sans flex flex-col">
            <header className="flex-shrink-0 flex flex-col sm:flex-row justify-between items-center bg-white p-3 sm:p-2 shadow-sm border-b gap-2 sm:gap-4 z-20">
                <h1 className="text-2xl md:text-3xl font-bold text-purple-800">{data.texto}</h1>
                <div className="flex items-center space-x-2">
                </div>
            </header>

            <div className="">
                    <h2 className="text-xl text-black font-bold mb-4">Opciones</h2>
                    <div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center rounded-lg shadow-sm p-2">
                            {data.Respuestas.map((respuesta, index)=>(
                                <div key={index} className="flex-auto  flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-md">
                                    <label className="block text-sm font-medium text-black"
                                    >{respuesta.textoRespuesta}</label>
                                </div>
                            ))}
                        </div>
                    </div>
            </div>
        </div>
    );
}

export default QuizNOptions;