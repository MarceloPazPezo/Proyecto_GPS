import React from 'react';
import { FaStar, FaRegImage, FaPlus, FaTimes } from 'react-icons/fa';
import { MdFlashOn } from 'react-icons/md';
import { GiCrystalBars } from 'react-icons/gi';
import { TbWorld } from 'react-icons/tb';
import { PiPuzzlePieceFill } from 'react-icons/pi';

/*considerar mover a componentes */
const AnswerOption = ({ color, Icon, text, isOptional = false }) => (
    <div className={`flex items-center ${color} rounded-lg shadow-sm p-2 space-x-2`}>
        <div className={`flex items-center justify-center w-16 h-16 rounded-md ${color}`}>
            <Icon className="text-white text-3xl" />
        </div>
        <div className="flex-grow flex items-center">
            <input
                type="text"
                placeholder={`${text} ${isOptional ? '(opcional)' : ''}`}
                className="w-full bg-transparent focus:outline-none p-2 text-white placeholder-white"
            />
        </div>
    </div>
);



function QuizCrear() {
    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            {/* Barra Superior */}
            <header className="flex justify-between items-center bg-white px-4 py-2 shadow-sm border-b">
                <div className="flex items-center space-x-4">
                    <h1 className="text-3xl font-bold text-purple-800">Freehoot!</h1>
                   
                </div>
                <div className="flex items-center space-x-2">
                    <button className="bg-gray-200 text-gray-700 rounded-md px-4 py-2 font-semibold hover:bg-gray-300">
                        Salir
                    </button>
                    <button className="bg-green-600 text-white rounded-md px-4 py-2 font-bold hover:bg-green-700">
                        Guardar
                    </button>
                </div>
            </header>

            {/* Contenido principal  */}

            <main className="flex flex-col" style={{ height: 'calc(100vh - 60px)' }}>
                <div className="flex flex-grow overflow-y-auto">
                    <div className="flex-grow p-6 relative overflow-y-auto">
                        <div
                            className="absolute inset-0 bg-cover bg-center bg-gradient-to-bl from-sky-500 to-blue-600"
                        ></div>

                        <div className="relative z-10 max-w-4xl mx-auto bg-white/30 backdrop-blur-md rounded-xl shadow-lg p-8">
                            <input
                                type="text"
                                placeholder="Escribe tu pregunta"
                                className="w-full text-center text-3xl font-bold p-4 bg-white/60 backdrop-blur rounded-lg shadow-md mb-4 placeholder-gray-400"
                            />

                            <div className="bg-white/60 backdrop-blur rounded-lg shadow-md p-6 text-center mb-4">
                                <div className="flex justify-center items-center space-x-4 text-gray-500 mb-4">
                                    <FaRegImage size={24} />
                                </div>
                                <div className="flex flex-col items-center">
                                    <button className="w-20 h-20 border-2 border-gray-300 rounded-lg flex items-center justify-center text-4xl text-gray-400 hover:bg-gray-50 bg-white/40 backdrop-blur">
                                        <FaPlus />
                                    </button>
                                    <p className="mt-2 text-gray-600">Busca e inserta los elementos multimedia</p>
                                    <p className="text-sm text-gray-500">
                                        <span className="font-bold text-amber-700 cursor-pointer hover:underline">Cargar archivo</span>
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <AnswerOption color="bg-orange-600/80" Icon={MdFlashOn} text="Añadir respuesta 1" />
                                <AnswerOption color="bg-purple-700/80" Icon={GiCrystalBars} text="Añadir respuesta 2" />
                                <AnswerOption color="bg-amber-500/80" Icon={TbWorld} text="Añadir respuesta 3" isOptional={true} />
                                <AnswerOption color="bg-cyan-700/80" Icon={PiPuzzlePieceFill} text="Añadir respuesta 4" isOptional={true} />
                            </div>

                            <div className="flex justify-center mt-4">
                                <button className="bg-gray-800/80 text-white font-semibold px-4 py-2 rounded-full flex items-center space-x-2 hover:bg-gray-900/80 backdrop-blur">
                                    <FaPlus />
                                    <span>Añadir más respuestas</span>
                                </button>
                            </div>
                        </div>
                    </div>

                 {   /* Barra lateral derecha, igual podria ser mejor que sea desplegable a que se estatica */}
                    <aside className="w-80 bg-white p-4 border-l">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Configuraciones</h2>
                            <FaTimes className="text-gray-500 cursor-pointer text-2xl" />
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-700 mb-2"></h3>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg h-24 flex items-center justify-center cursor-pointer hover:bg-gray-50">
                                <FaPlus className="text-gray-400 text-3xl" />
                            </div>
                        </div>

                    </aside>
                </div>

                {/* Barra inferior  */}
                <div className="w-full bg-white p-1 border-t flex flex-col md:flex-row justify-between items-center">
                    <div>

                        <div className="border-2 border-blue-500 rounded-lg p-2">

                            <div className="bg-gray-200 h-16 w-16 rounded-md flex items-center justify-center">
                                <FaRegImage className="text-gray-400 text-2xl" />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col space-y-4 mt-4 md:mt-0 md:ml-4 w-full md:w-auto">
                        <button className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 w-full md:w-auto">
                            Añadir pregunta
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default QuizCrear;
