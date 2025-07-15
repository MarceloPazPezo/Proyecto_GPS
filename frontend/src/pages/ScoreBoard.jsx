const ScoreBoard=()=>{ 
    const leaderBorad=JSON.parse(sessionStorage.getItem("scores"));
    console.log(leaderBorad);
    return(
        <div>
            <h1
            className=" p-2 w-full text-black"
            >Puntuaciones</h1>
            {leaderBorad.map((player,index)=>(
            <div key={index}>
                {index} {player.nickname} {player.puntos}
            </div>
            ))}
        </div>
    )
}

export default ScoreBoard;