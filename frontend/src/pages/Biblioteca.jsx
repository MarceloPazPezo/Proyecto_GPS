import useQuizzes from "../hooks/crearQuiz/getQuiz.jsx";
import SharePopUp from "../components/SharePopUp.jsx";
import { showSuccessAlert, showErrorAlert, deleteDataAlert } from "../helpers/sweetAlert.js"
import { useNavigate } from "react-router-dom";
import QuizCard from "../components/QuizCard.jsx";
import { shareQuiz,shareQuizMany } from "../services/compartido.service.js"
import { eliminarQuiz } from "../services/quiz.service.js";
import useUsers from "../hooks/users/useGetUsers.jsx"
import { useState } from "react";
const Biblioteca = () => {
    const { fetchQuizzes, quizzes } = useQuizzes();
    const {users} = useUsers();
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [id, setId] = useState(0);

    const crearQuiz = () => {
        navigate("/createQuiz");
    }

    const deleteQuiz = async (quiz) => {
        if (quiz.iduser === JSON.parse(sessionStorage.getItem("usuario")).id) {
            if (await deleteDataAlert()) {
                try {
                    const response = await eliminarQuiz({ id: quiz.idquiz, idUser: quiz.iduser, nombre: quiz.nombre });
                    if (response) {
                        showSuccessAlert("Eliminado", "El quiz fue eliminado con  exito");
                        fetchQuizzes();
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        } else {
            showErrorAlert("Error", "Debe ser el propietario del Quiz para eliminarlo");
        }
    }

    const compartirQuiz = async (lista) => {
        console.log(lista)
        try {
            let response;
            if(lista.length===0){
                showErrorAlert();
            }else{
                response= await shareQuizMany(id,lista);
                //console.log(response);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const seleccionar = (id) => {
        setShow(true)
        setId(id);
    }

    return (
        <main>
            <div>
                <button className="w-150 bg-white/20 border border-white/30 text-white font-bold py-3 rounded-lg mt-6 transition-all duration-200 hover:bg-white/30 hover:-translate-y-0.5"
                    onClick={crearQuiz}>Crear Cuestionario</button>
            </div>
            <div className="bg-white/30 backdrop-blur-lg border border-white/20 shadow-xl p-8 sm:p-10 rounded-2xl mb-6 mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {
                    quizzes.map((quiz,index) => (
                        <QuizCard
                            key={index}
                            onDelete={deleteQuiz}
                            onShare={seleccionar}
                            quiz={quiz}
                        />
                    ))
                }
            </div>
            <div>
                <SharePopUp
                    action={compartirQuiz}
                    isPopupOpen={show}
                    setShow={setShow}
                    data={users}
                    show={show}
                />
            </div>
        </main>
    )
}

export default Biblioteca;