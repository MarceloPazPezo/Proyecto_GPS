import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { socket } from "../main.jsx"; // Asegúrate de que la ruta a socket sea correcta
import Confetti from 'react-confetti';
import { FaCrown } from 'react-icons/fa';

// Hook personalizado para obtener las dimensiones de la ventana (necesario para el confeti)
const useWindowSize = () => {
    const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
    useEffect(() => {
        const handleResize = () => setSize([window.innerWidth, window.innerHeight]);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return { width: size[0], height: size[1] };
};

// Componente para una "barra" del podio
const PodiumStep = ({ player, rankText, rankColor, podiumHeight, isFirstPlace = false }) => (
    <div className="flex flex-col items-center mx-1">
        <p className="text-white font-bold text-xl sm:text-2xl truncate max-w-[150px]">{player.nickname}</p>
        <div
            className={`w-24 sm:w-32 rounded-t-lg flex flex-col items-center justify-between p-2 text-white shadow-2xl ${rankColor} ${podiumHeight}`}
        >
            {isFirstPlace && <FaCrown className="text-yellow-300 text-3xl mb-2" />}
            <div className="flex-grow flex flex-col justify-center items-center">
                <p className="font-extrabold text-4xl">{rankText}</p>
                <p className="font-semibold text-lg">{player.puntos} pts</p>
            </div>
        </div>
    </div>
);

const ScoreBoard = () => {
    const navigate = useNavigate();
    const { width, height } = useWindowSize();

    // Tu lógica se mantiene intacta
    const getScores = () => {
        try {
            const scores = JSON.parse(sessionStorage.getItem("scores"));
            if (scores && Array.isArray(scores)) {
                // Ordenar por puntos de mayor a menor
                return scores.sort((a, b) => b.puntos - a.puntos);
            }
        } catch (e) {
            console.error("Error parsing scores from sessionStorage", e);
        }
        return [];
    };

    const leaderBoard = getScores();
    const topThree = leaderBoard.slice(0, 3);
    const restOfPlayers = leaderBoard.slice(3);

    const finalizarAct = () => {
        // Asegúrate de que `sala` se obtiene correctamente
        socket.emit("finnish", { sala: sessionStorage.getItem('sala') });
        sessionStorage.removeItem("sala");
        sessionStorage.removeItem("participantes");
        sessionStorage.removeItem("scores");
        navigate("/room"); // O a la ruta que consideres apropiada, como /home o /join
    };

    return (
        // Contenedor principal con fondo de gradiente y confeti
        <div className="min-h-screen w-full bg-gradient-to-b from-[#4EB9FA] to-[#2C3E50] flex flex-col items-center justify-center p-4 overflow-hidden">
            <Confetti width={width} height={height} recycle={false} numberOfPieces={400} />

            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-8 text-center shadow-text">¡Podio de Ganadores!</h1>

            {/* Podio para los 3 primeros lugares */}
            {topThree.length > 0 && (
                <div className="flex items-end justify-center mb-10 h-64 sm:h-80">
                    {/* 2do Lugar (Plata) */}
                    {topThree[1] && (
                        <PodiumStep player={topThree[1]} rankText="2º" rankColor="bg-gray-400" podiumHeight="h-4/6" />
                    )}
                    {/* 1er Lugar (Oro) */}
                    {topThree[0] && (
                        <PodiumStep player={topThree[0]} rankText="1º" rankColor="bg-yellow-500" podiumHeight="h-full" isFirstPlace={true} />
                    )}
                    {/* 3er Lugar (Bronce) */}
                    {topThree[2] && (
                        <PodiumStep player={topThree[2]} rankText="3º" rankColor="bg-orange-500" podiumHeight="h-3/6" />
                    )}
                </div>
            )}

            {/* Lista para el resto de los jugadores */}
            {restOfPlayers.length > 0 && (
                <div className="w-full max-w-md bg-white/20 backdrop-blur-sm rounded-xl shadow-lg mt-4">
                    <div className="max-h-60 overflow-y-auto p-2">
                        {restOfPlayers.map((player, index) => (
                            <div key={player.nickname} className="flex justify-between items-center text-white font-semibold p-3 border-b border-white/20 last:border-none">
                                <span>{index + 4}. {player.nickname}</span>
                                <span>{player.puntos} pts</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Botón para finalizar */}
            <button
                className="bg-white text-[#2C3E50] font-bold py-3 px-8 rounded-lg mt-12 transition-all duration-300 hover:bg-gray-200 hover:-translate-y-1 shadow-2xl"
                onClick={finalizarAct}>
                Finalizar Actividad
            </button>
        </div>
    );
};

export default ScoreBoard;