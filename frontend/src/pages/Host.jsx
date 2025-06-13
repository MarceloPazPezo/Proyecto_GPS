import { useState } from "react";
import { socket } from "../main";

const Host = () => {
    const [timer, setTimer] = useState(0);
    let i=timer;
    const startTimer = async (event) => {
        event.preventDefault();
        setInterval(() => {
            if(i>0){
                i--;
                setTimer(i);
                socket.emit("timer",{time:i});
            }
            console.log(i);
        }, 1000);

    }

    return (
        <div className="container">
            <main>
                <form onSubmit={startTimer}>
                    <h1>Timer: {timer}</h1>
                    <input
                        name="message"
                        type="number"
                        onChange={(e) => setTimer(e.target.value)}
                        className="border-2 border-zinc-500 p-2 w-full text-black"
                        value={timer}
                        autoFocus
                    />
                </form>
            </main>
        </div>
    )
}
export default Host;