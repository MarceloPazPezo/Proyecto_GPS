import React, { useState } from "react";
import useGetMisCarreras from "../hooks/carreras/useGetMisCarreras";
import { FaThLarge, FaList, FaGraduationCap, FaCalendarAlt, FaBuilding, FaCode, FaUsers, FaChartLine } from "react-icons/fa";
import { MdSchool, MdDateRange, MdTrendingUp } from "react-icons/md";
import { format as formatDate, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

const MisCarreras = () => {
  const { carreras, loading } = useGetMisCarreras();
  const [viewMode, setViewMode] = useState("cards");

  const gradients = [
    'from-blue-500 via-purple-500 to-pink-500',
    'from-green-400 via-blue-500 to-purple-600',
    'from-yellow-400 via-red-500 to-pink-500',
    'from-purple-400 via-pink-500 to-red-500',
    'from-indigo-500 via-purple-500 to-pink-500',
    'from-teal-400 via-blue-500 to-indigo-600',
    'from-orange-400 via-red-500 to-purple-600',
    'from-cyan-400 via-blue-500 to-purple-500',
  ];

  // Estadísticas
  const stats = {
    total: carreras.length,
    departamentos: [...new Set(carreras.map(c => c.departamento))].length,
    recientes: carreras.filter(c => {
      if (!c.createdAt) return false;
      const createdDate = new Date(c.createdAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return createdDate > thirtyDaysAgo;
    }).length
  };

  return (
    <main className="max-w-7xl mx-auto w-full px-4 py-6">
      <div className="max-w-7xl mx-auto">
        {/* Header mejorado */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <FaGraduationCap className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-[#2C3E50] mb-2">Mis Carreras</h1>
                <p className="text-[#7F8C8D] text-lg">Gestiona y visualiza las carreras que tienes asignadas</p>
              </div>
            </div>
            
            {/* Controles de vista */}
            <div className="flex items-center gap-3 bg-white rounded-xl p-2 shadow-lg border border-gray-200">
              <button
                className={`p-3 rounded-lg transition-all duration-300 flex items-center gap-2 ${
                  viewMode === "cards" 
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md transform scale-105" 
                    : "text-[#7F8C8D] hover:bg-gray-100 hover:text-[#2C3E50]"
                }`}
                onClick={() => setViewMode("cards")}
                title="Vista de tarjetas"
              >
                <FaThLarge size={18} />
                <span className="hidden sm:inline font-medium">Tarjetas</span>
              </button>
              <button
                className={`p-3 rounded-lg transition-all duration-300 flex items-center gap-2 ${
                  viewMode === "list" 
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md transform scale-105" 
                    : "text-[#7F8C8D] hover:bg-gray-100 hover:text-[#2C3E50]"
                }`}
                onClick={() => setViewMode("list")}
                title="Vista de lista"
              >
                <FaList size={18} />
                <span className="hidden sm:inline font-medium">Lista</span>
              </button>
            </div>
          </div>

          {/* Panel de estadísticas */}
          {!loading && carreras.length > 0 && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total de Carreras</p>
                    <p className="text-3xl font-bold">{stats.total}</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-xl">
                    <MdSchool size={24} />
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Departamentos</p>
                    <p className="text-3xl font-bold">{stats.departamentos}</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-xl">
                    <FaBuilding size={24} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Vista de Tarjetas Mejorada */}
        {viewMode === "cards" && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-[#7F8C8D] text-lg font-medium">Cargando carreras...</p>
                </div>
              </div>
            ) : carreras.length === 0 ? (
              <div className="col-span-full flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="p-6 bg-gray-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <FaGraduationCap className="text-gray-400 text-3xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#2C3E50] mb-2">No tienes carreras asignadas</h3>
                  <p className="text-[#7F8C8D]">Contacta con el administrador para que te asigne carreras</p>
                </div>
              </div>
            ) : (
              carreras.map((carrera, index) => (
                <div
                  key={carrera.id}
                  className={`group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br ${gradients[index % gradients.length]} p-8`}
                  style={{ minHeight: "380px" }}
                >
                  {/* Efecto de brillo */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  {/* Contenido de la tarjeta */}
                  <div className="relative z-10 h-full flex flex-col">
                    {/* Header de la tarjeta */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {carrera.nombre?.charAt(0) || "C"}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-1 line-clamp-2 leading-tight">
                            {carrera.nombre}
                          </h3>
                          <div className="flex items-center gap-2">
                            <FaCode className="text-white/80 text-sm" />
                            <span className="text-white/90 font-mono text-sm font-medium">
                              {carrera.codigo}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Información principal */}
                    <div className="flex-1 space-y-4">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                        <p className="text-white/90 text-sm leading-relaxed line-clamp-3">
                          {carrera.descripcion || "Sin descripción disponible"}
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white/20 rounded-lg">
                            <FaBuilding className="text-white text-sm" />
                          </div>
                          <div>
                            <p className="text-white/70 text-xs font-medium">Departamento</p>
                            <p className="text-white font-semibold">{carrera.departamento}</p>
                          </div>
                        </div>

                        {carrera.createdAt && (
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg">
                              <FaCalendarAlt className="text-white text-sm" />
                            </div>
                            <div>
                              <p className="text-white/70 text-xs font-medium">Fecha de creación</p>
                              <p className="text-white font-semibold">
                                {formatDate(parseISO(carrera.createdAt), 'dd MMM yyyy', { locale: es })}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer de la tarjeta */}
                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-white/90 text-sm font-medium">Activa</span>
                      </div>
                      <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                        <span className="text-white text-xs font-semibold">Carrera Asignada</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Vista de Lista Mejorada */}
        {viewMode === "list" && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-[#7F8C8D] text-lg font-medium">Cargando carreras...</p>
                </div>
              </div>
            ) : carreras.length === 0 ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="p-6 bg-gray-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <FaGraduationCap className="text-gray-400 text-3xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#2C3E50] mb-2">No tienes carreras asignadas</h3>
                  <p className="text-[#7F8C8D]">Contacta con el administrador para que te asigne carreras</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[#2C3E50] uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <MdSchool className="text-blue-500" />
                          Carrera
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[#2C3E50] uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <FaCode className="text-purple-500" />
                          Código
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[#2C3E50] uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <FaBuilding className="text-green-500" />
                          Departamento
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[#2C3E50] uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className="text-orange-500" />
                          Fecha
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[#2C3E50] uppercase tracking-wider">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {carreras.map((carrera, index) => (
                      <tr 
                        key={carrera.id} 
                        className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 group"
                      >
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradients[index % gradients.length]} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                              <span className="text-white font-bold text-lg">
                                {carrera.nombre?.charAt(0) || "C"}
                              </span>
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-[#2C3E50] group-hover:text-blue-600 transition-colors duration-300">
                                {carrera.nombre}
                              </h3>
                              <p className="text-sm text-[#7F8C8D] line-clamp-1">
                                {carrera.descripcion || "Sin descripción"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg font-mono text-sm font-medium">
                              {carrera.codigo}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-[#2C3E50] font-medium">
                              {carrera.departamento}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="text-sm">
                            {carrera.createdAt ? (
                              <div>
                                <p className="text-[#2C3E50] font-medium">
                                  {formatDate(parseISO(carrera.createdAt), 'dd MMM yyyy', { locale: es })}
                                </p>
                                <p className="text-[#7F8C8D] text-xs">
                                  {formatDate(parseISO(carrera.createdAt), 'HH:mm', { locale: es })}
                                </p>
                              </div>
                            ) : (
                              <span className="text-[#7F8C8D]">No disponible</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                              Activa
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default MisCarreras;
