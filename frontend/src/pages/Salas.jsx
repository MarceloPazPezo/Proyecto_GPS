import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../main";
import useQuizzes from "../hooks/crearQuiz/getQuiz.jsx";
import PopUpMuralSelector from "../components/PopUpMuralSelector.jsx";
import { FaQuestionCircle, FaCloud, FaChalkboard } from 'react-icons/fa';

export default function Salas() {
  const navigate = useNavigate();
  const { quizzes } = useQuizzes();

  const [roomName, setRoomName] = useState("");
  const [actividad, setActividad] = useState("");
  const [idSala, setIdSala] = useState("");
  const [participantes, setParticipantes] = useState([]);
  const [idQuiz, setIdQuiz] = useState(0);
  const [mostrarSelectorMural, setMostrarSelectorMural] = useState(false);
  const [muralSeleccionado, setMuralSeleccionado] = useState(null);

  useEffect(() => {
    socket.on("message", receiveMessage);
    socket.on("join", onJoin);
    return () => {
      socket.off("message", receiveMessage);
      socket.off("join", onJoin);
    };
  }, []);

  function receiveMessage(message) {
    if (message.sala) {
      setIdSala(message.sala);
      sessionStorage.setItem(
        "sala",
        JSON.stringify({ sala: message.sala, name: "host" })
      );
    }
  }

  function onJoin(data) {
    setParticipantes((prev) => [data, ...prev]);
  }

  function createRoom() {
    if (!roomName.trim() || !actividad) return;
    socket.emit("create", { sala: roomName.trim(), tipo: actividad });
  }

  function iniciarAct() {
    sessionStorage.setItem("participantes", JSON.stringify(participantes));
    socket.emit("start", { actividad });
    if (actividad === "quiz") {
      navigate(`/host/${idQuiz}`);
    } else if (actividad === "pizarra") {
      navigate("/hostIdeas");
    } else if (actividad === "notas") {
      if (!muralSeleccionado) {
        setMostrarSelectorMural(true);
        return;
      }
      sessionStorage.setItem("muralSeleccionado", JSON.stringify(muralSeleccionado));
      socket.emit("enviarIdMural", { idMural: muralSeleccionado.id });
      navigate(`/stickyHost/${muralSeleccionado.id}`);
    }
  }

  function cancelarAct() {
    socket.emit("finnish", { sala: sessionStorage.getItem("sala") });
    sessionStorage.removeItem("sala");
    window.location.reload();
  }

  return (
    <main className="flex-1 bg-sky-100 flex items-center justify-center min-h-screen p-4 sm:p-8">
      { !sessionStorage.getItem("sala") ? (
        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-4xl w-full">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
            Crear una sala
          </h1>
          <p className="text-gray-600 mb-8 text-center">
            Elige el tipo de actividad para tu sala.
          </p>
          <form
            className="space-y-8"
            onSubmit={(e) => {
              e.preventDefault();
              createRoom();
            }}
          >
            {/* Nombre de la sala */}
            <div>
              <label
                htmlFor="room-name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nombre de la sala
              </label>
              <input
                id="room-name"
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Ej: Sala de Innovación"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 text-gray-800"
              />
            </div>

            {/* Tipo de actividad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Tipo de actividad
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { 
                    icon: FaQuestionCircle, 
                    label: "Quiz", 
                    value: "quiz",
                    color: "text-[#4EB9FA]"
                  },
                  { 
                    icon: FaCloud, 
                    label: "Nube de palabras", 
                    value: "pizarra",
                    color: "text-[#65CD73]"
                  },
                  { 
                    icon: FaChalkboard, 
                    label: "Pizarra de proyecto", 
                    value: "notas",
                    color: "text-[#FF9233]"
                  },
                ].map((act) => (
                  <div
                    key={act.value}
                    onClick={() => setActividad(act.value)}
                    className={`border-2 border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ease-in-out hover:border-sky-500 hover:bg-sky-50 ${
                      actividad === act.value
                        ? "border-sky-600 bg-sky-100 ring-2 ring-sky-500"
                        : ""
                    }`}
                  >
                    <act.icon className={`${act.color} text-5xl mb-3`} />
                    <span className="font-semibold text-gray-800">
                      {act.label}
                    </span>
                  </div>
                ))}
              </div>
              <input
                id="activity-type"
                name="activity-type"
                type="hidden"
                value={actividad}
              />
            </div>

            {/* Botón Crear Sala */}
            <button
              type="submit"
              disabled={!roomName.trim() || !actividad}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-4 rounded-lg text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Crear Sala
            </button>
          </form>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-8 w-full max-w-5xl">
          {/* Participantes */}
          <div className="w-full max-w-md">
            <p className="p-3 text-center text-white bg-[#2C3E50] rounded-t-lg font-semibold">
              Conectados: {participantes.length}
            </p>
            <ul className="w-full bg-white/50 border border-gray-200 text-black font-medium rounded-b-lg max-h-48 overflow-y-auto">
              {participantes.length > 0 ? (
                participantes.map((p, i) => (
                  <li
                    key={i}
                    className="p-3 border-b border-gray-200 last:border-b-0"
                  >
                    <span className="text-green-600">🟢</span> {p.nickname}
                  </li>
                ))
              ) : (
                <li className="p-3 text-gray-500 text-center">
                  Esperando participantes...
                </li>
              )}
            </ul>
          </div>

          {/* ID de sala */}
          <div className="text-center">
            <p className="text-xl font-bold text-[#2C3E50] mb-2">
              Nombre de la sala:
            </p>
            <h1 className="text-4xl font-bold text-[#4EB9FA] break-words">
              {idSala}
            </h1>
          </div>

          {/* Selección de quiz */}
          {actividad === "quiz" && (
            <div className="w-full">
              <h3 className="text-xl font-semibold text-center mb-4 text-[#2C3E50]">
                Selecciona un Quiz
              </h3>
              <fieldset className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {quizzes.map((quiz) => (
                  <div
                    key={quiz.idquiz}
                    onClick={() => setIdQuiz(quiz.idquiz)}
                    className={`relative bg-white rounded-xl shadow-lg flex flex-col justify-between border-2
                      ${
                        idQuiz === quiz.idquiz
                          ? "border-blue-500 ring-2 ring-blue-500/50"
                          : "border-transparent"
                      }
                      hover:shadow-2xl transition-transform transform hover:-translate-y-1 duration-300 ease-in-out
                      cursor-pointer`}
                  >
                    <input
                      type="radio"
                      name="quizSelect"
                      checked={idQuiz === quiz.idquiz}
                      readOnly
                      className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="p-4 h-full flex flex-col">
                      <div className="text-lg font-bold text-[#2C3E50] mb-2 truncate">
                        {quiz.nombre}
                      </div>
                      <div className="text-sm text-gray-500 mt-auto">
                        Autor: {quiz.usuario}
                      </div>
                    </div>
                  </div>
                ))}
              </fieldset>
            </div>
          )}

          {/* Botones iniciar / cancelar */}
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mt-4">
            <button
              onClick={iniciarAct}
              disabled={
                participantes.length === 0 ||
                (actividad === "quiz" && idQuiz === 0)
              }
              className="w-full bg-green-500 text-white font-bold py-3 rounded-lg transition-all duration-200 hover:bg-green-600 hover:-translate-y-0.5 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Iniciar Actividad
            </button>
            <button
              onClick={cancelarAct}
              className="w-full bg-red-500 text-white font-bold py-3 rounded-lg transition-all duration-200 hover:bg-red-600 hover:-translate-y-0.5"
            >
              Cancelar Sala
            </button>
          </div>

          {/* Selector de mural para \"notas\" */}
          {mostrarSelectorMural && (
            <PopUpMuralSelector
              idUser={JSON.parse(sessionStorage.getItem("usuario")).id}
              onConfirm={(mural) => {
                setMuralSeleccionado(mural);
                setMostrarSelectorMural(false);
                iniciarAct();
              }}
              onCancel={() => setMostrarSelectorMural(false)}
            />
          )}
        </div>
      )}
    </main>
  );
}
