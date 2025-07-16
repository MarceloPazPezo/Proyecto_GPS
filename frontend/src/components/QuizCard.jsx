import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaShareAlt, FaCalendarAlt, FaUser } from 'react-icons/fa';
import { showErrorAlert } from '../helpers/sweetAlert';

// Agregamos la prop 'gradientClass' y le damos un valor por defecto por si acaso.
const QuizCard = ({ quiz, onDelete, onShare, gradientClass = 'from-sky-500 to-indigo-600' }) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    const currentUser = JSON.parse(sessionStorage.getItem("usuario"));
    if (currentUser && quiz.iduser === currentUser.id) {
      navigate(`/updateQuiz/${quiz.idquiz}`);
    } else {
      showErrorAlert("Acceso denegado", "Debe ser el propietario para editar este cuestionario.");
    }
  };

  const handleDelete = () => {
    onDelete(quiz);
  };
  
  const handleShare = () => {
    onShare(quiz.idquiz);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col justify-between transition-shadow duration-300 hover:shadow-xl">
      
      {/* 1. Cabecera con Gradiente Dinámico */}
      {/* Usamos template literals para inyectar la clase del gradiente */}
      <div className={`bg-gradient-to-br ${gradientClass} p-8 flex items-center justify-center`}>
        <h2 
          className="text-white text-2xl font-bold text-center h-16 line-clamp-2" 
          title={quiz.nombre}
        >
          {quiz.nombre || 'Sin Título'}
        </h2>
      </div>

      {/* 2. Cuerpo Blanco (sin cambios aquí) */}
      <div className="p-5 flex flex-col flex-grow">
        <p className="text-gray-800 font-semibold mb-3 truncate" title={quiz.usuario ? `Autor: ${quiz.usuario}` : 'Autor desconocido'}>
          {quiz.usuario ? `Autor: ${quiz.usuario}` : 'Autor desconocido'}
        </p>

        <div className="flex items-center text-gray-500 text-sm mb-5 space-x-6">
          <div className="flex items-center">
            <FaCalendarAlt className="mr-2" />
            <span>{quiz.fechaCreacion || 'Fecha no disponible'}</span>
          </div>
          <div className="flex items-center">
            <FaUser className="mr-2" />
            <span>{quiz.num_preguntas || 0} preguntas</span>
          </div>
        </div>
        
        <div className="flex-grow"></div>

        <div className="flex items-center justify-end space-x-4 pt-2">
          <button
            onClick={handleEdit}
            className="text-[#FF9233]/70 hover:text-[#2C3E50] transition-colors duration-200"
            title="Editar Cuestionario"
          >
            <FaEdit size={18} />
          </button>
          
          <button
            onClick={handleShare}
            className="text-[#65CD73] hover:text-[#2C3E50] transition-colors duration-200"
            title="Compartir"
          >
            <FaShareAlt size={18} />
          </button>

          <button
            onClick={handleDelete}
            className="text-red-400 hover:text-[#2C3E50] transition-colors duration-200"
            title="Eliminar Cuestionario"
          >
            <FaTrash size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizCard;