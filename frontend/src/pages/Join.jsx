import { useNavigate } from "react-router-dom";
import Form from "../components/Form.jsx"
import { useState, useEffect } from 'react';
//import io from "socket.io-client";
import { socket } from "../main.jsx";
import useLogin from "../hooks/auth/useLogin.jsx";
import fondoSVG from '../assets/fondo_azul.svg'; 

//const socket=io("/");

const Join = () => {

    const { handleInputChange } = useLogin();

    const navigate = useNavigate();

    useEffect(() => {
        socket.on("message", receiveMessage);
    }, []);

    const handleSubmit = (data) => {
        //console.log(data);
        socket.emit("join", data);
        //navigate("/quiz");
    };

    const receiveMessage = (message) => {
        if (message.sala) {
            navigate("/espera");
        }
    }

    return (
        <main className="flex items-center justify-center min-h-screen w-full p-4 font-sans"
                    style={{
                        backgroundImage: `url(${fondoSVG})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}>
            <div>{/*sessionStorage.getItem('sala')?<div>
                <h1>Esperando que inicie la actividad</h1>
            </div>:*/
                <Form
                    title="Unirse a una actividad"
                    fields={[
                        {
                            label: "Codigo de la sala",
                            name: "sala",
                            fieldType: 'input',
                            type: "String",
                            required: true,
                            minLength: 5,
                            maxLength: 20,
                            onChange: (e) => handleInputChange('String', e.target.value),
                        },
                        {
                            label: "Elije un apodo para que los demas te vean",
                            name: "nickname",
                            fieldType: 'input',
                            type: "String",
                            required: true,
                            minLength: 3,
                            maxLength: 30,
                            pattern: /^[a-zA-Z0-9ñ]+$/,
                            patternMessage: "Debe contener solo letras y números",
                            onChange: (e) => handleInputChange('String', e.target.value)
                        },
                    ]}
                    buttonText="Unirse"
                    onSubmit={handleSubmit}
                />
            }</div>
        </main>
    )
}
export default Join;