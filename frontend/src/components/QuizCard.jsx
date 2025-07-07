import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaShareAlt, FaPlay } from 'react-icons/fa';
import { showErrorAlert } from '../helpers/sweetAlert';

const QuizCard = ({ quiz, onDelete, onShare }) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    if (quiz.iduser == JSON.parse(sessionStorage.getItem("usuario")).id) {
      navigate(`/updateQuiz/${quiz.idquiz}`);
    } else {
      showErrorAlert("Acceso denegado", "Debe ser el propietario para editar un cuestionario.");
    }
  };

  const handleStartSession = () => {
    navigate(`/host/${quiz.id}`);
  };

  const truncateDescription = (text, maxLength) => {
    if (!text || text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col justify-between border border-[#ECEDF2] hover:shadow-2xl transition-transform transform hover:-translate-y-2 duration-300 ease-in-out">
      {/* Contenido de la tarjeta */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-[#2C3E50] mb-2 truncate">{quiz.nombre}</h3>
        <p className="text-[#4EB9FA] text-sm h-16">
          {truncateDescription("Creado por " + quiz.usuario, 90) || 'Este cuestionario no tiene descripción.'}
        </p>
      </div>

      {/* Pie de la tarjeta con acciones */}
      <div className="bg-[#ECEDF2] px-6 py-4 flex justify-between items-center">
        {/* Botones de acción (izquierda) */}
        <div className="flex space-x-3">
          <button
            onClick={handleEdit}
            className="text-[#FF9233]/70 hover:text-[#2C3E50] transition-colors duration-200"
            title="Editar Cuestionario"
          >
            <FaEdit size={18} />
          </button>
          
          <button
            onClick={() => onShare(quiz.idquiz)}
            className="text-[#65CD73] hover:text-[#2C3E50] transition-colors duration-200"
            title="Compartir"
          >
            <FaShareAlt size={18} />
          </button>

          <button
            onClick={() => onDelete(quiz)}
            className="text-red-400 hover:text-[#2C3E50] transition-colors duration-200"
            title="Eliminar Cuestionario"
          >
            <FaTrash size={18} />
          </button>
        </div>

        {/* Botón para iniciar sesión (derecha) */}
        <button
          onClick={handleStartSession}
          className="bg-[#4EB9FA] hover:bg-[#5EBFFA] text-white font-bold py-2 px-4 rounded-full flex items-center transition-all duration-300"
          title="Iniciar Sesión"
        >
          <FaPlay className="mr-2" size={12} />
          <span>Iniciar</span>
        </button>
      </div>
    </div>
  );
};

export default QuizCard;