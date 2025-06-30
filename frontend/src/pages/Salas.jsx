import { socket } from "../main";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useLogin from "../hooks/auth/useLogin.jsx";
import Form from "../components/Form";


const Salas = () => {
    const navigate = useNavigate();
    const { handleInputChange } = useLogin();
    const [actividad,setActividad]=useState('');
    const [id, setId] = useState("");
    const [participantes, setParticipantes] = useState([])

    const createRoom = (data) => {
        socket.emit("create", { sala: data.sala});
        setActividad(data.actividad);
    }

    const receiveMessage = (message) => {
        if (message.sala) {
            setId(message.sala);
            sessionStorage.setItem('sala', JSON.stringify({ sala: message.sala, name: 'host' }));
        }
        //console.log(sessionStorage.getItem('sala'));
    }

    const cancelarAct = () => {
        socket.emit('finnish', { sala: sessionStorage.getItem('sala') })
        sessionStorage.removeItem('sala');
        window.location.reload();
    }

    const onJoin = (data) => {
        //console.log(data);
        setParticipantes((state)=>[data, ...state]);
    }

    useEffect(() => {
        socket.on("message", receiveMessage);
        socket.on("join", onJoin);
    }, []);

    const iniciarAct = () => {
        sessionStorage.setItem("participantes",participantes);
        socket.emit("start",{actividad:actividad});
        if(actividad==='quiz') navigate("/host");
        if(actividad==='pizarra') navigate("/hostIdeas");
    }

    const ideaspizarraAct = () =>{
        
    }


    return (
        <main >
            {!sessionStorage.getItem('sala') ? 
            <Form
                title={`Crear una sala`}
                fields={[
                    {
                        label: "Nombre de la sala",
                        name: "sala",
                        fieldType: 'input',
                        type: "String",
                        required: true,
                        minLength: 5,
                        maxLength: 20,
                        onChange: (e) => handleInputChange('String', e.target.value),
                    },
                    {
                        label:"Tipo de actividad",
                        fieldType:'select',
                        name:"actividad",
                        required:true,
                        options: [{label:"Quiz",value:'quiz'},{label:"Pizarra",value:'pizarra'}]
                    }
                ]}
                buttonText={"Iniciar"}
                onSubmit={createRoom}
            /> :
             <div>
                <div>
                    <p className="p-2 text-white bg-black">Conectados:</p>
                    <ul className="w-full bg-white/20 border border-white/30 text-white font-bold py-3 rounded-lg mt-6 transition-all duration-200 ">
                        {participantes.map((participante, index) => (
                            <li key={index}><b>{"🟢"+ participante.nickname}</b></li>
                        ))}
                    </ul>
                </div>
                <p className="text-3xl font-bold text-white mb-8 text-left" >Nombre de la sala:</p>
                <h1 className="text-3xl font-bold text-white mb-8 text-center">{id}</h1>
                <button
                    //onMouseOver={"bg-yellow"}
                    onClick={iniciarAct}
                    disabled={participantes.length===0}
                    className="center w-150 bg-white/20 border border-white/30 text-white font-bold py-3 rounded-lg mt-6 transition-all duration-200 hover:bg-white/30 hover:-translate-y-0.5"
                >Iniciar Actividad</button>
                <button 
                onClick={cancelarAct} 
                className="w-150 bg-white/20 border border-white/30 text-white font-bold py-3 rounded-lg mt-6 transition-all duration-200 hover:bg-white/30 hover:-translate-y-0.5"
                >Cancelar</button>
            </div>}
        </main>
    )
}

export default Salas;