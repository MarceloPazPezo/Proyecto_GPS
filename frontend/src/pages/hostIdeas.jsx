import { useState } from "react";
import { socket } from "../main";


const hostIdeas = () => {

    const [message, setMessage] = useState("");
    const [preg,setPreg]=useState(false);
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(message);
        setPreg(true);
    }
    return (
        <div className="container">
            {preg?<h5 className="text-8xl">{message}</h5>
            :<form onSubmit={handleSubmit} className="bg-zinc-900 p-10">
                <h1 className="text-2xl font-bold my-2 text-amber-50 ">Pregunta</h1>
                <input
                    name="message"
                    type="text"
                    placeholder="Write your message..."
                    onChange={(e) => setMessage(e.target.value)}
                    className="border-2 border-zinc-500 p-2 w-full text-amber-50"
                    value={message}
                    autoFocus
                />
            </form>}
        </div>
    )
}

export default hostIdeas