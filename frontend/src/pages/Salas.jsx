import { socket } from "../main";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useLogin from "../hooks/auth/useLogin.jsx";
import Form from "../components/Form";

const Salas = () => {
    const navigate = useNavigate();
    const [id, setId] = useState("");
    const [participantes, setParticipantes] = useState([])

    const createRoom = (data) => {
        socket.emit("create", { sala: data.sala });
    }

    const receiveMessage = (message) => {
        if (message.sala) {
            setId(message.sala);
            sessionStorage.setItem('sala', JSON.stringify({ sala: message.sala, name: 'host' }));
        }
        console.log(sessionStorage.getItem('sala'));
    }

    const cancelarAct = () => {
        socket.emit('finnish', { sala: sessionStorage.getItem('sala') })
        sessionStorage.removeItem('sala');
        window.location.reload();
    }

    const onJoin = (data) => {
        console.log(data);
        setParticipantes([data]);
        console.log(participantes);
    }

    useEffect(() => {
        socket.on("message", receiveMessage);
        socket.on("join", onJoin);
        return () => {
            socket.off("message", receiveMessage);
        };
    }, []);

    const { handleInputChange } = useLogin();

    const iniciarAct = () => {
        navigate("/host");
    }

    return (
        <main className="container">
            {!sessionStorage.getItem('sala') ? <Form
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
                ]}
                buttonText={"Iniciar"}
                onSubmit={createRoom}
            /> : <div>
                <div>
                    <p>Conectados:</p>
                    <ul>
                        {participantes.map((nickname, index) => {
                            <li key={index}>{index}{nickname}</li>
                        })}
                    </ul>
                </div>
                <p>Nombre de la sala:</p>
                <h1>{id}</h1>
                <button
                    onClick={iniciarAct}
                >Iniciar Actividad</button>
                <button onClick={cancelarAct}>Cancelar</button>
            </div>}
        </main>
    )
}

export default Salas;