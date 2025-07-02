import useQuizzes from "../hooks/crearQuiz/getQuiz.js";
import Table from "../components/Table.jsx"
import { useNavigate } from "react-router-dom";
const Cuestionarios = () => {
    const { fetchQuizzes, quizzes } = useQuizzes();
    //console.log(idUser);
    const navigate = useNavigate();
    const columns = [
        { title: "Nombre", field: "nombre", width: 350, responsive: 0 },
        { title: "Creado por:", field: "usuario", width: 200, responsive: 2 },
    ];

    const crearQuiz = () => {
        navigate("/createQuiz");
    }
    const click = () => {
        console.log(quizzes);
    }
    return (
        <main>
            <div>
                <button className="w-150 bg-white/20 border border-white/30 text-white font-bold py-3 rounded-lg mt-6 transition-all duration-200 hover:bg-white/30 hover:-translate-y-0.5"
                    onClick={crearQuiz}>Crear Cuestionario</button>
            </div>
            <div className="mt-8 p-6 bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg rounded-2xl">
                <button className="w-40 bg-white/20 border border-white/30 text-white font-bold py-3 rounded-lg mt-6 transition-all duration-200 hover:bg-white/30 hover:-translate-y-0.5"
                    onClick={click}>Compartir</button>
                <Table
                    columns={columns}
                    data={quizzes}
                    dataToFilter={'nombre'}
                    initialSortName={'nombre'}
                ></Table>
            </div>
        </main>
    )
}

export default Cuestionarios;