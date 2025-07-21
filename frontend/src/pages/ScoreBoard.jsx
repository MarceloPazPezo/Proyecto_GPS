import { useNavigate } from "react-router-dom";
const ScoreBoard = () => {
    const navigate = useNavigate();
    function getScores() {
        const scores = JSON.parse(sessionStorage.getItem("scores"));
        if (scores) {
            sessionStorage.removeItem("scores");
            return scores
        } else {
            return [];
        }

    }
    const leaderBorad = getScores();
    return (
        <div>
            <h1
                className=" p-2 w-full text-black flex justify-center "
            >Puntuaciones</h1>
            {leaderBorad.map((player, index) => (
                <div key={index} className="items-center text-black">
                    {index + 1} {player.nickname} {player.puntos}
                </div>
            ))}
            <div>
                <button
                    className="center w-150 bg-white/20 border border-black/30 text-[#2C3E50] font-bold py-3 rounded-lg mt-6 transition-all duration-200 hover:bg-white/30 hover:-translate-y-0.5"
                    onClick={() => navigate("/room")}>
                    Finalizar
                </button>
            </div>
        </div>
    )
}

export default ScoreBoard;