import React, { useState } from "react";
import useGetMisCarreras from "../hooks/carreras/useGetMisCarreras";
import { FaThLarge, FaList } from "react-icons/fa";

const MisCarreras = () => {
  const { carreras, loading } = useGetMisCarreras();
  const [viewMode, setViewMode] = useState("list");

  const gradients = [
    'from-sky-500 to-indigo-600',
    'from-green-400 to-cyan-500',
    'from-amber-400 to-orange-500',
    'from-pink-500 to-rose-500',
    'from-violet-500 to-purple-600',
    'from-teal-400 to-emerald-500',
  ];

  return (
    <main className="max-w-7xl mx-auto w-full px-2">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-[#2C3E50]">Mis Carreras</h1>
          <div className="flex items-center gap-2">
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
          </div>
        </div>

        {/* Vista de Tarjetas */}
        {viewMode === "cards" && (
          <div className="bg-white/80 backdrop-blur-lg border border-[#4EB9FA]/20 shadow-xl p-10 rounded-2xl mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-10 max-h-[600px] overflow-y-auto">
            {loading ? (
              <div className="col-span-full text-center text-[#2C3E50] text-lg font-medium animate-pulse">Cargando...</div>
            ) : carreras.length === 0 ? (
              <div className="col-span-full text-center text-[#2C3E50] text-lg font-medium">No tienes carreras asociadas.</div>
            ) : (
              carreras.map((carrera, index) => (
                <div
                  key={carrera.id}
                  className={`rounded-3xl shadow-2xl hover:shadow-3xl transition-shadow duration-300 p-10 flex flex-col border-2 border-[#4EB9FA]/40 hover:border-[#4EB9FA] bg-gradient-to-br ${gradients[index % gradients.length]}`}
                  style={{ minHeight: "320px" }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center text-[#4EB9FA] font-bold text-xl shadow">
                      {carrera.nombre?.charAt(0) || "C"}
                    </div>
                    <h2 className="text-xl font-bold text-white drop-shadow">{carrera.nombre}</h2>
                  </div>
                  <p className="text-white font-medium mb-1">Código: <span className="font-mono text-white/90">{carrera.codigo}</span></p>
                  <p className="text-white/80 italic mb-2">{carrera.descripcion}</p>
                  <p className="text-white/80 mb-2">Departamento: <span className="font-semibold">{carrera.departamento}</span></p>
                  <div className="mt-auto flex justify-end">
                    <span className="px-3 py-1 bg-white/80 text-[#4EB9FA] rounded-full text-xs font-semibold">Carrera asignada</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Vista de Lista */}
        {viewMode === "list" && (
          <div className="bg-white/80 backdrop-blur-lg border border-[#4EB9FA]/20 shadow-xl p-6 sm:p-8 rounded-2xl mb-6 max-h-[600px] overflow-y-auto">
            {loading ? (
              <div className="text-center text-[#2C3E50] py-4 animate-pulse">Cargando...</div>
            ) : carreras.length === 0 ? (
              <div className="text-center text-[#2C3E50] py-4">No tienes carreras asociadas.</div>
            ) : (
              <table className="w-full text-left border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-[#2C3E50] font-bold text-lg">
                    <th className="py-2">Nombre</th>
                    <th className="py-2">Código</th>
                    <th className="py-2">Descripción</th>
                    <th className="py-2">Departamento</th>
                  </tr>
                </thead>
                <tbody>
                  {carreras.map((carrera) => (
                    <tr key={carrera.id} className="bg-[#ECEDF2] rounded-lg shadow-sm">
                      <td className="py-3 px-4 font-semibold text-[#2C3E50]">{carrera.nombre}</td>
                      <td className="py-3 px-4 text-[#4EB9FA] font-mono">{carrera.codigo}</td>
                      <td className="py-3 px-4 text-[#2C3E50] italic">{carrera.descripcion}</td>
                      <td className="py-3 px-4 text-[#2C3E50]">{carrera.departamento}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default MisCarreras;
