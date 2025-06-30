import { useState, useEffect } from "react";
import { getComaprtidos } from "../services/compartido.service.js";
import { getCuestionarios } from "../services/cuestionario.service.js";
import Table from "../components/Table.jsx"
const Cuestionarios = () => {
    const idUser = sessionStorage.getItem('usuario').id;
    const [quizzes, setQuizzes] = useState([]);

    const cuestionarios = async () => {
        try {
            const cuest = await getCuestionarios(idUser)
            setQuizzes((state) => [state, ...cuest]);
        } catch (error) {
            console.error(error);
        }
    }

    const comaprtidos = async () => {
        try {
            const comp = await getComaprtidos(idUser);
            setQuizzes((state) => [state, ...comp])
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getComaprtidos;
    }, [])
    return (
        <div className="container">
            <Table
            /*columns={}
            data={}
            filter={}*/
            ></Table>
        </div>
    )
}