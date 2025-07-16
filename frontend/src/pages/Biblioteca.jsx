import useQuizzes from "../hooks/crearQuiz/getQuiz.jsx";
import SharePopUp from "../components/SharePopUp.jsx";
import { showSuccessAlert, showErrorAlert, deleteDataAlert } from "../helpers/sweetAlert.js"
import { useNavigate } from "react-router-dom";
import QuizCard from "../components/QuizCard.jsx";
import {shareQuizMany,deleteForMe} from "../services/compartido.service.js"
import { eliminarQuiz } from "../services/quiz.service.js";
import useUsers from "../hooks/users/useGetUsers.jsx"
import { useState } from "react";
import { FaThLarge, FaList, FaEdit, FaTrash, FaShareAlt } from "react-icons/fa";

const Biblioteca = () => {
    const { fetchQuizzes, quizzes } = useQuizzes();
    const { users } = useUsers();
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [id, setId] = useState(0);
    const [viewMode, setViewMode] = useState("cards");

    // --- CAMBIO 1: Define tu paleta de gradientes aquí ---
    // Puedes añadir, quitar o cambiar los colores que quieras.
    // Todos están diseñados para combinar con la estética de tu app.
    const gradients = [
        'from-sky-500 to-indigo-600',       // Azul a Índigo
        'from-green-400 to-cyan-500',      // Verde a Cian
        'from-amber-400 to-orange-500',    // Ámbar a Naranja
        'from-pink-500 to-rose-500',       // Rosa a Rosa Fuerte
        'from-violet-500 to-purple-600',   // Violeta a Púrpura
        'from-teal-400 to-emerald-500',    // Turquesa a Esmeralda
    ];

    const crearQuiz = () => {
        navigate("/createQuiz");
    }

    const deleteQuiz = async (quiz) => {
        if (quiz.iduser === JSON.parse(sessionStorage.getItem("usuario")).id) {
            if (await deleteDataAlert()) {
                try {
                    const response = await eliminarQuiz({ id: quiz.idquiz, idUser: quiz.iduser, nombre: quiz.nombre });
                    if (response) {
                        showSuccessAlert("Eliminado", "El quiz fue eliminado con éxito");
                        fetchQuizzes();
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        } else {
            if(await deleteDataAlert()){
                const response = await deleteForMe(quiz.idquiz,JSON.parse(sessionStorage.getItem("usuario")).id);
                if(response.status === 200) {
                    showSuccessAlert("Eliminado","Se ha quitado de su biblioteca");
                    fetchQuizzes();
                }
            }
        }
    }

    const compartirQuiz = async (lista) => {
        try {
            if (lista.length === 0) {
                showErrorAlert();
            } else {
                await shareQuizMany(id, lista);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const seleccionar = (id) => {
        setShow(true);
        setId(id);
    }

    return (
        <main className="max-w-7xl mx-auto w-full px-2">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-[#2C3E50]">Mi Biblioteca</h1>
                    <div className="flex items-center gap-2">
                        {/* Botones de vista y crear */}
                        <button
                            className={`p-2 rounded-lg border transition-colors duration-200 ${viewMode === "cards" ? "bg-[#4EB9FA] text-white border-[#4EB9FA]" : "bg-white text-[#2C3E50] border-[#ECEDF2] hover:bg-[#ECEDF2]"}`}
                            onClick={() => setViewMode("cards")}
                            title="Vista de tarjetas"
                        >
                            <FaThLarge size={20} />
                        </button>
                        <button
                            className={`p-2 rounded-lg border transition-colors duration-200 ${viewMode === "list" ? "bg-[#4EB9FA] text-white border-[#4EB9FA]" : "bg-white text-[#2C3E50] border-[#ECEDF2] hover:bg-[#ECEDF2]"}`}
                            onClick={() => setViewMode("list")}
                            title="Vista de lista"
                        >
                            <FaList size={20} />
                        </button>
                        <button
                            className="bg-[#4EB9FA] hover:bg-[#5EBFFA] text-white font-semibold px-6 py-3 rounded-lg shadow transition-all duration-200 border border-[#4EB9FA] hover:-translate-y-0.5 ml-2"
                            onClick={crearQuiz}
                        >
                            Crear Cuestionario
                        </button>
                    </div>
                </div>

                {/* Vista de Tarjetas */}
                {viewMode === "cards" && (
                    <div className="bg-white/80 backdrop-blur-lg border border-[#4EB9FA]/20 shadow-xl p-8 sm:p-10 rounded-2xl mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {quizzes.length === 0 ? (
                            <div className="col-span-full text-center text-[#2C3E50] text-lg font-medium">
                                No tienes cuestionarios aún.
                            </div>
                        ) : (
                            // --- CAMBIO 2: Pasa la prop 'gradientClass' a cada tarjeta ---
                            quizzes.map((quiz, index) => (
                                <QuizCard
                                    key={quiz.idquiz} // Usar un ID único es mejor que el index para la key
                                    onDelete={deleteQuiz}
                                    onShare={seleccionar}
                                    quiz={quiz}
                                    gradientClass={gradients[index % gradients.length]} // ¡Aquí está la magia!
                                />
                            ))
                        )}
                    </div>
                )}

                {/* Vista de Lista (sin cambios) */}
                {viewMode === "list" && (
                     <div className="bg-white/80 backdrop-blur-lg border border-[#4EB9FA]/20 shadow-xl p-6 sm:p-8 rounded-2xl mb-6">
                        <table className="w-full text-left border-separate border-spacing-y-2">
                            <thead>
                                <tr className="text-[#2C3E50] font-bold text-lg">
                                    <th className="py-2">Nombre</th>
                                    <th className="py-2">Autor</th>
                                    <th className="py-2">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {quizzes.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="text-center text-[#2C3E50] py-4">No tienes cuestionarios aún.</td>
                                    </tr>
                                ) : (
                                    quizzes.map((quiz) => (
                                        <tr key={quiz.idquiz} className="bg-[#ECEDF2] rounded-lg shadow-sm">
                                            <td className="py-3 px-4 font-semibold text-[#2C3E50]">{quiz.nombre}</td>
                                            <td className="py-3 px-4 text-[#4EB9FA]">{quiz.usuario}</td>
                                            <td className="py-3 px-4 flex gap-4">
                                                <button
                                                    onClick={() => navigate(`/updateQuiz/${quiz.idquiz}`)}
                                                    className="text-[#FF9233]/70 hover:text-[#2C3E50] transition-colors duration-200"
                                                    title="Editar Cuestionario"
                                                >
                                                    <FaEdit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => seleccionar(quiz.idquiz)}
                                                    className="text-[#65CD73] hover:text-[#2C3E50] transition-colors duration-200"
                                                    title="Compartir"
                                                >
                                                    <FaShareAlt size={18} />
                                                </button>
                                                <button
                                                    onClick={() => deleteQuiz(quiz)}
                                                    className="text-red-400 hover:text-[#2C3E50] transition-colors duration-200"
                                                    title="Eliminar Cuestionario"
                                                >
                                                    <FaTrash size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

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