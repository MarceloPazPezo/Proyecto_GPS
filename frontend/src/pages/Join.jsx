import { useNavigate } from "react-router-dom";
import Form from "../components/Form.jsx"
import {useEffect} from 'react';
//import io from "socket.io-client";
import { socket } from "../main.jsx";
import useLogin from "../hooks/auth/useLogin.jsx";

//const socket=io("/");

const Join = () => {

    const {handleInputChange}=useLogin();

    const navigate=useNavigate();

    useEffect(() => {
        socket.on("message", receiveMessage)

        return () => {
            socket.off("message", receiveMessage);
        };
    }, []);

    const handleSubmit = (data) => {
    //console.log(data);
    socket.emit("join", data);
    //navigate("/quiz");
  };

   const receiveMessage = (message) =>{
    console.log(message);
    if(message.sala){
        sessionStorage.setItem('sala',message);
        navigate("/quiz");

    }
    //console.log("Mensaje recibido");
  }

    return (
        <main className="container">
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
                        pattern: /^[a-zA-Z0-9]+$/,
                        patternMessage: "Debe contener solo letras y números",
                        onChange: (e) => handleInputChange('String', e.target.value)
                    },
                ]}
                buttonText="Unirse"
                onSubmit={handleSubmit}
            />
        </main>
    )
}
export default Join;