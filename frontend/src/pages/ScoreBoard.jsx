import { useNavigate } from "react-router-dom";
const ScoreBoard=()=>{ 
    const navigate=useNavigate();
    function getScores(){
        const scores=JSON.parse(sessionStorage.getItem("scores"));
        if(scores){
            sessionStorage.removeItem("scores");
            return scores
        }else{
            return [];
        }
        
    }
    const leaderBorad=getScores();
    return(
        <div>
            <h1
            className=" p-2 w-full text-black"
            >Puntuaciones</h1>
            {leaderBorad.map((player,index)=>(
            <div key={index}  className="items-center text-black">
                {index+1} {player.nickname} {player.puntos}
            </div>
            ))}
            <div>
                <button
                className="text-black border-2 rounded-xl" 
                onClick={()=>navigate("/room")}>
                    Finalizar
                </button>
            </div>
        </div>
    )
}

export default ScoreBoard;