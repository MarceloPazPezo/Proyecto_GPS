import { useNavigate } from "react-router-dom";
import Form from "../components/Form.jsx"
import { useState, useEffect } from 'react';
//import io from "socket.io-client";
import { socket } from "../main.jsx";
import useLogin from "../hooks/auth/useLogin.jsx";
import fondoSVG from '../assets/fondo_azul.svg';
import { showErrorAlert } from "../helpers/sweetAlert.js";
import useRegister from '@hooks/auth/useRegister.jsx';
import { getUser } from "../services/user.service.js";

//const socket=io("/");

const Join = () => {
    const patternRut = new RegExp(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/)

    const { handleInputChange } = useLogin();
    const{ errorRut} = useRegister();
    const navigate = useNavigate();

    useEffect(() => {
        socket.on("message", receiveMessage);
    }, []);

    const handleSubmit = async (data) => {
        //console.log(data);
        const resp=await getUser(data.rut);
        //onsole.log(resp)
        if(resp.status==='Client error'){
            showErrorAlert(resp.message,"verifique el rut");
        }else{
            socket.emit("join", {sala:data.sala, nickname:resp.data});
        }
        //
        //navigate("/quiz");
    };

    const receiveMessage = (message) => {
        if (message.sala) {
            if (message.tipo === 'notas') {
                navigate("/notas");
            }
            if (message.tipo === 'pizarra') {
                navigate("/ideas");
            }
            if (message.tipo === 'quiz') {
                navigate("/espera");
            }
        } else {
            showErrorAlert("Error al conectar", "La sala igresada no existe, verifica el codigo de la sala");
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
                            label: "Rut",
                            name: "rut",
                            placeholder: "23.456.789-1",
                            fieldType: 'input',
                            type: "text",
                            minLength: 9,
                            maxLength: 12,
                            pattern: patternRut,
                            patternMessage: "Debe ser xx.xxx.xxx-x o xxxxxxxx-x",
                            required: true,
                            errorMessageData: errorRut,
                            onChange: (e) => handleInputChange('rut', e.target.value)
                        },
                        /*{
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
                        },*/
                    ]}
                    buttonText="Unirse"
                    onSubmit={handleSubmit}
                />
            }</div>
        </main>
    )
}
export default Join;