import { socket } from "../main";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useLogin from "../hooks/auth/useLogin.jsx";
import Form from "../components/Form";

const Salas = () => {
    const navigate=useNavigate();
    const [id, setId] = useState("");

    const createRoom = (data) => {
        socket.emit("create",{codigo:data.codigo});
    }

    const receiveMessage = (message) => {
        console.log(message);
        if(message.id) setId(message.id);
        //console.log("Mensaje recibido");
    }
    useEffect(() => {
        socket.on("message", receiveMessage)
        return () => {
            socket.off("message", receiveMessage);
        };
    }, []);

    const {handleInputChange}=useLogin();

    const iniciarAct=()=>{
        navigate("/host");
    }

    return (
        <main className="container">
            <Form
                title={`Crear una sala`}
                fields={[
                    {
                        label: "Nombre de la sala",
                        name: "codigo",
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
            />
            <p>Nombre de la sala:</p>
            <p>{id}</p>
            <button onClick={iniciarAct}>Iniciar Actividad</button>
        </main>
    )
}

export default Salas;