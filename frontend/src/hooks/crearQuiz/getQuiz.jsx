import { useState, useEffect } from "react";
import { getCuestionariosByUser } from "../../services/quiz.service.js";

const useQuizzes = () => {
    const idUser = JSON.parse(sessionStorage.getItem('usuario')).id;
    const [quizzes, setQuizzes] = useState([]);
    
    const fetchQuizzes = async () => {
        try {
            const cuest = await getCuestionariosByUser(idUser);
            setQuizzes([...cuest]);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchQuizzes();
    }, [])

    return {quizzes,setQuizzes,fetchQuizzes};

}
export default useQuizzes;