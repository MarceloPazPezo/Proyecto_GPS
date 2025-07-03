import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaShareAlt, FaPlay } from 'react-icons/fa';

const QuizCard = ({ quiz, onDelete, onShare }) => {
  const navigate = useNavigate();

  // Navega a la página de edición del cuestionario.
  const handleEdit = () => {
    navigate(`/updateQuiz/${quiz.idquiz}`);
  };

  // Navega para iniciar una sesión con este cuestionario.
  const handleStartSession = () => {
    navigate(`/host/${quiz.id}`);
  };

  // Trunca la descripción si es demasiado larga.
  const truncateDescription = (text, maxLength) => {
    if (!text || text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col justify-between transition-transform transform hover:-translate-y-2 duration-300 ease-in-out">
      {/* Contenido de la tarjeta */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">{quiz.nombre}</h3>
        <p className="text-gray-600 text-sm h-16">
          {truncateDescription("Creado por " +quiz.usuario, 90) || 'Este cuestionario no tiene descripción.'}
        </p>
      </div>

      {/* Pie de la tarjeta con acciones */}
      <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
        {/* Botones de acción (izquierda) */}
        <div className="flex space-x-3">
          <button
            onClick={handleEdit}
            className="text-gray-500 hover:text-blue-600 transition-colors duration-200"
            title="Editar Cuestionario"
          >
            <FaEdit size={18} />
          </button>
          <button
            onClick={() => onDelete(quiz)}
            className="text-gray-500 hover:text-red-600 transition-colors duration-200"
            title="Eliminar Cuestionario"
          >
            <FaTrash size={18} />
          </button>
          <button
            onClick={() => onShare(quiz.idquiz)}
            className="text-gray-500 hover:text-green-600 transition-colors duration-200"
            title="Compartir"
          >
            <FaShareAlt size={18} />
          </button>
        </div>

        {/* Botón para iniciar sesión (derecha) */}
        <button
          onClick={handleStartSession}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full flex items-center transition-all duration-300"
          title="Iniciar Sesión"
        >
          <FaPlay className="mr-2" size={12}/>
          <span>Iniciar</span>
        </button>
      </div>
    </div>
  );
};

export default QuizCard;