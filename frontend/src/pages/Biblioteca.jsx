import useQuizzes from "../hooks/crearQuiz/getQuiz.jsx";
import useGetMurales from "../hooks/mural/useGetMurales.jsx";
import SharePopUp from "../components/SharePopUp.jsx";
import { showSuccessAlert, showErrorAlert, deleteDataAlert } from "../helpers/sweetAlert.js";
import { useNavigate } from "react-router-dom";
import QuizCard from "../components/QuizCard.jsx";
import { shareQuizMany, deleteForMe } from "../services/compartido.service.js";
import { eliminarQuiz } from "../services/quiz.service.js";
import { deleteMural } from "../services/stickNotes.service.js";
import useUsers from "../hooks/users/useGetUsers.jsx";
import { useState } from "react";
import { FaThLarge, FaList, FaEdit, FaTrash, FaShareAlt } from "react-icons/fa";
import { updateMural } from "../services/stickNotes.service.js";
import PopUpUpdateMural from "../components/PopUpUpdateMural.jsx";

const Biblioteca = () => {
    const { fetchQuizzes, quizzes } = useQuizzes();
    const { users } = useUsers();
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [id, setId] = useState(0);
    const [viewMode, setViewMode] = useState("cards");
    const [viewModeMurales, setViewModeMurales] = useState("cards");

    const userId = JSON.parse(sessionStorage.getItem("usuario")).id;
    const { murales, loading: loadingMurales, error: errorMurales, fetchMurales } = useGetMurales(userId);

    const gradients = [
        'from-sky-500 to-indigo-600',
        'from-green-400 to-cyan-500',
        'from-amber-400 to-orange-500',
        'from-pink-500 to-rose-500',
        'from-violet-500 to-purple-600',
        'from-teal-400 to-emerald-500',
    ];

    const crearQuiz = () => {
        navigate("/createQuiz");
    };

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [muralAEditar, setMuralAEditar] = useState(null);

    const abrirEditarMural = (mural) => {
        setMuralAEditar(mural);
        setIsEditModalOpen(true);
    };

    const guardarMuralEditado = async (nuevoTitulo) => {
        if (!muralAEditar) return;
        try {
            await updateMural(muralAEditar.id, { titulo: nuevoTitulo });
            showSuccessAlert("Mural actualizado", "El título del mural fue actualizado.");
            fetchMurales();
            setIsEditModalOpen(false);
        } catch (error) {
            const errorMessage = error?.message || "No se pudo actualizar el mural.";
            showErrorAlert(errorMessage);
        }
    };

    const deleteQuiz = async (quiz) => {
        if (quiz.iduser === userId) {
            if (await deleteDataAlert()) {
                try {
                    await eliminarQuiz({ id: quiz.idquiz, idUser: quiz.iduser, nombre: quiz.nombre });
                    showSuccessAlert("Eliminado", "El quiz fue eliminado con éxito");
                    fetchQuizzes();
                } catch (error) {
                    console.error(error);
                }
            }
        } else {
            if (await deleteDataAlert()) {
                const response = await deleteForMe(quiz.idquiz, userId);
                if (response.status === 200) {
                    showSuccessAlert("Eliminado", "Se ha quitado de su biblioteca");
                    fetchQuizzes();
                }
            }
        }
    };

    const deleteMuralAction = async (idMural) => {
        if (await deleteDataAlert()) {
            try {
                await deleteMural(idMural);
                showSuccessAlert("Eliminado", "El mural fue eliminado con éxito");
                fetchMurales();
            } catch (error) {
                console.error(error);
            }
        }
    };

    const compartirQuiz = async (lista) => {
        if (lista.length === 0) {
            showErrorAlert();
        } else {
            await shareQuizMany(id, lista);
        }
    };

    const seleccionar = (id) => {
        setShow(true);
        setId(id);
    };

    return (
        <main className="max-w-7xl mx-auto w-full px-2">
            <div className="max-w-7xl mx-auto">
                {/* === Header === */}
                <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-[#2C3E50]">Mi Biblioteca</h1>
                </div>

                {/* === Cuestionarios === */}
                <section>
                    <h2 className="text-2xl font-semibold text-[#2C3E50] mb-6">Mis Cuestionarios</h2>
                    <div className="flex items-center gap-2 mb-6">
                        <button className={`p-2 rounded-lg border transition-colors duration-200 ${viewMode === "cards" ? "bg-[#4EB9FA] text-white border-[#4EB9FA]" : "bg-white text-[#2C3E50] border-[#ECEDF2] hover:bg-[#ECEDF2]"}`} onClick={() => setViewMode("cards")}><FaThLarge size={20} /></button>
                        <button className={`p-2 rounded-lg border transition-colors duration-200 ${viewMode === "list" ? "bg-[#4EB9FA] text-white border-[#4EB9FA]" : "bg-white text-[#2C3E50] border-[#ECEDF2] hover:bg-[#ECEDF2]"}`} onClick={() => setViewMode("list")}><FaList size={20} /></button>
                        <button onClick={crearQuiz} className="bg-[#4EB9FA] hover:bg-[#5EBFFA] text-white font-semibold px-6 py-3 rounded-lg shadow transition-all duration-200 border border-[#4EB9FA] hover:-translate-y-0.5 ml-2">
                            Crear Cuestionario
                        </button>
                    </div>

                    {viewMode === "cards" ? (
                        <div className="bg-white/80 backdrop-blur-lg border border-[#4EB9FA]/20 shadow-xl p-8 sm:p-10 rounded-2xl mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {quizzes.length === 0 ? (
                                <div className="col-span-full text-center text-[#2C3E50] text-lg font-medium">
                                    No tienes cuestionarios aún.
                                </div>
                            ) : quizzes.map((quiz, index) => (
                                <QuizCard
                                    key={quiz.idquiz}
                                    onDelete={deleteQuiz}
                                    onShare={seleccionar}
                                    quiz={quiz}
                                    gradientClass={gradients[index % gradients.length]}
                                />
                            ))}
                        </div>
                    ) : (
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
                                        <tr><td colSpan={3} className="text-center text-[#2C3E50] py-4">No tienes cuestionarios aún.</td></tr>
                                    ) : quizzes.map((quiz) => (
                                        <tr key={quiz.idquiz} className="bg-[#ECEDF2] rounded-lg shadow-sm">
                                            <td className="py-3 px-4 font-semibold text-[#2C3E50]">{quiz.nombre}</td>
                                            <td className="py-3 px-4 text-[#4EB9FA]">{quiz.usuario}</td>
                                            <td className="py-3 px-4 flex gap-4">
                                                <button onClick={() => navigate(`/updateQuiz/${quiz.idquiz}`)} className="text-[#FF9233]/70 hover:text-[#2C3E50] transition-colors duration-200"><FaEdit size={18} /></button>
                                                <button onClick={() => seleccionar(quiz.idquiz)} className="text-[#65CD73] hover:text-[#2C3E50] transition-colors duration-200"><FaShareAlt size={18} /></button>
                                                <button onClick={() => deleteQuiz(quiz)} className="text-red-400 hover:text-[#2C3E50] transition-colors duration-200"><FaTrash size={18} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                {/* === Murales === */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold text-[#2C3E50] mb-6">Mis Murales</h2>
                    <div className="flex items-center gap-2 mb-6">
                        <button
                            className={`p-2 rounded-lg border transition-colors duration-200 ${viewModeMurales === "cards" ? "bg-[#4EB9FA] text-white border-[#4EB9FA]" : "bg-white text-[#2C3E50] border-[#ECEDF2] hover:bg-[#ECEDF2]"}`}
                            onClick={() => setViewModeMurales("cards")}
                        >
                            <FaThLarge size={20} />
                        </button>
                        <button
                            className={`p-2 rounded-lg border transition-colors duration-200 ${viewModeMurales === "list" ? "bg-[#4EB9FA] text-white border-[#4EB9FA]" : "bg-white text-[#2C3E50] border-[#ECEDF2] hover:bg-[#ECEDF2]"}`}
                            onClick={() => setViewModeMurales("list")}
                        >
                            <FaList size={20} />
                        </button>
                    </div>
                    {loadingMurales && <div className="text-center text-[#2C3E50]">Cargando murales...</div>}
                    {errorMurales && <div className="text-center text-red-500">Error al cargar murales</div>}
                    {!loadingMurales && murales.length === 0 && <div className="text-center text-[#2C3E50]">No tienes murales aún.</div>}
                    {!loadingMurales && murales.length > 0 && (
                        <div className="bg-white/80 backdrop-blur-lg border border-[#4EB9FA]/20 shadow-xl p-6 rounded-2xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {murales.map((mural) => (
                                <div key={mural.idmural} className="bg-gradient-to-r from-indigo-400 to-purple-500 rounded-lg shadow-md p-4 flex flex-col justify-between">
                                    <h3 className="text-white font-bold text-lg mb-2 truncate">{mural.titulo}</h3>
                                    <div className="flex justify-end gap-3">
                                        <button
                                            onClick={() => abrirEditarMural(mural)}
                                            className="text-[#FF9233]/70 hover:text-[#2C3E50] transition-colors duration-200"
                                            title="Editar Mural"
                                        >
                                            <FaEdit size={18} />
                                        </button>
                                        <button
                                            onClick={() => deleteMuralAction(mural.id)}
                                            className="text-red-400 hover:text-[#2C3E50] transition-colors duration-200"
                                            title="Eliminar Mural"
                                        >
                                            <FaTrash size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <SharePopUp
                    action={compartirQuiz}
                    isPopupOpen={show}
                    setShow={setShow}
                    data={users}
                    show={show}
                />
            </div>
            <PopUpUpdateMural
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={guardarMuralEditado}
                tituloActual={muralAEditar?.titulo || ""}
            />
        </main>
    );
};

export default Biblioteca;
