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
import PopUpUpdateMural from "../components/popupUpdateMural.jsx";
import { updateMural } from "../services/stickNotes.service.js";

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
        <main className="max-w-7xl mx-auto w-full px-2 p-10">
            <div className="max-w-7xl mx-auto">
                {/* === Header === */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <h1 className="text-3xl font-bold text-[#2C3E50]">Mi Biblioteca</h1>
                </div>
                <p class="text-gray-500 mt-1">Gestiona tus cuestionarios, nubes de palabras y pizarras.</p>

                {/* === Cuestionarios === */}
                <section className="mt-12 mb-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                        <h2 className="text-3xl font-semibold text-[#2C3E50]">Mis Cuestionarios</h2>
                        <div className="flex items-center gap-2">
                            <button className={`p-2 rounded-lg border transition-colors duration-200 ${viewMode === "cards" ? "bg-[#4EB9FA] text-white border-[#4EB9FA]" : "bg-white text-[#2C3E50] border-[#ECEDF2] hover:bg-[#ECEDF2]"}`} onClick={() => setViewMode("cards")}><FaThLarge size={20} /></button>
                            <button className={`p-2 rounded-lg border transition-colors duration-200 ${viewMode === "list" ? "bg-[#4EB9FA] text-white border-[#4EB9FA]" : "bg-white text-[#2C3E50] border-[#ECEDF2] hover:bg-[#ECEDF2]"}`} onClick={() => setViewMode("list")}><FaList size={20} /></button>
                            <button onClick={crearQuiz} className="bg-[#4EB9FA] hover:bg-[#5EBFFA] text-white font-semibold px-6 py-3 rounded-lg shadow transition-all duration-200 border border-[#4EB9FA] hover:-translate-y-0.5 ml-2">
                                Crear Cuestionario
                            </button>
                        </div>
                    </div>

                    {viewMode === "cards" ? (
                        <div className="backdrop-blur-lg p-8 sm:p-10 mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                <section >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <h2 className="text-3xl font-semibold text-[#2C3E50]">Mis Murales</h2>
                        <div className="flex items-center gap-2">
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
                    </div>

                    {viewModeMurales === "cards" ? (
                        <div className="backdrop-blur-lg p-8 sm:p-10 mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {loadingMurales && (
                                <div className="col-span-full text-center text-[#2C3E50] text-lg font-medium">
                                    Cargando murales...
                                </div>
                            )}
                            {errorMurales && (
                                <div className="col-span-full text-center text-gray-800 text-lg font-medium">
                                    No se encontraron murales
                                </div>
                            )}
                            {!loadingMurales && murales.length === 0 && (
                                <div className="col-span-full text-center text-[#2C3E50] text-lg font-medium">
                                    No tienes murales aún.
                                </div>
                            )}
                            {!loadingMurales && murales.length > 0 && murales.map((mural, index) => (
                                <div key={mural.idmural} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col justify-between transition-shadow duration-300 hover:shadow-xl">
                                    <div className="bg-gradient-to-r from-indigo-400 to-purple-500 p-8 flex items-center justify-center">
                                        <h3 className="text-white text-2xl font-bold text-center h-16 line-clamp-2" title={mural.titulo}>
                                            {mural.titulo || 'Sin Título'}
                                        </h3>
                                    </div>
                                    <div className="p-5 flex flex-col flex-grow">
                                        <div className="flex items-center justify-between ">
                                            <span className="text-gray-600 text-sm font-medium">Acciones</span>
                                            <div className="flex items-center space-x-4">
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
                                    </div>
                                </div>
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
                                    {loadingMurales && (
                                        <tr><td colSpan={3} className="text-center text-[#2C3E50] py-4">Cargando murales...</td></tr>
                                    )}
                                    {errorMurales && (
                                        <tr><td colSpan={3} className="text-center text-gray-800 py-4">No se encontraron murales</td></tr>
                                    )}
                                    {!loadingMurales && murales.length === 0 && (
                                        <tr><td colSpan={3} className="text-center text-[#2C3E50] py-4">No tienes murales aún.</td></tr>
                                    )}
                                    {!loadingMurales && murales.length > 0 && murales.map((mural) => (
                                        <tr key={mural.idmural} className="bg-[#ECEDF2] rounded-lg shadow-sm">
                                            <td className="py-3 px-4 font-semibold text-[#2C3E50]">{mural.titulo}</td>
                                            <td className="py-3 px-4 text-[#4EB9FA]">{mural.usuario || 'Autor desconocido'}</td>
                                            <td className="py-3 px-4 flex gap-4">
                                                <button
                                                    onClick={() => abrirEditarMural(mural)}
                                                    className="text-[#FF9233]/70 hover:text-[#2C3E50] transition-colors duration-200"
                                                >
                                                    <FaEdit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => deleteMuralAction(mural.id)}
                                                    className="text-red-400 hover:text-[#2C3E50] transition-colors duration-200"
                                                >
                                                    <FaTrash size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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
