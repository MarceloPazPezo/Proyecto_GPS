import { useState } from "react";
import useGetMurales from "../hooks/mural/useGetMurales.jsx";
import useCreateMural from "../hooks/mural/useCreateMural.jsx";

const PopUpMuralSelector = ({ idUser, onConfirm, onCancel }) => {
    const { murales, loading: loadingMurales, error: errorMurales, fetchMurales } = useGetMurales(idUser);
    const { createMural, loading: creating, error: errorCrear } = useCreateMural();

    const [tituloNuevo, setTituloNuevo] = useState("");
    const [muralSeleccionado, setMuralSeleccionado] = useState(null);

    const handleCrearMural = async () => {
        if (!tituloNuevo.trim()) {
            alert("Por favor, ingresa un título para el mural");
            return;
        }
        try {
            const nuevo = await createMural({ titulo: tituloNuevo, usuario: idUser });
            setMuralSeleccionado(nuevo);
            setTituloNuevo("");
            fetchMurales();
        } catch {
            alert("Error al crear el mural");
        }
    };

    

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                <h2 className="text-2xl font-semibold mb-6 text-[#2C3E50]">Selecciona o crea un mural</h2>

                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Título para nuevo mural"
                        value={tituloNuevo}
                        onChange={(e) => setTituloNuevo(e.target.value)}
                        disabled={creating}
                        className="w-full border border-[#ECEDF2] rounded-lg px-4 py-2 mb-3 text-black focus:outline-none focus:ring-2 focus:ring-[#4EB9FA]"
                    />
                    <button
                        onClick={handleCrearMural}
                        disabled={creating}
                        className="w-full bg-[#4EB9FA] hover:bg-[#5EBFFA] text-white font-semibold py-2 rounded-lg transition"
                    >
                        {creating ? "Creando..." : "Crear mural"}
                    </button>
                    {errorCrear && <p className="text-red-500 mt-2">Error al crear mural</p>}
                </div>

                <div className="max-h-48 overflow-auto border border-[#ECEDF2] rounded-lg p-2">
                    <h3 className="font-semibold mb-2 text-[#2C3E50]">Murales existentes</h3>
                    {loadingMurales && <p className="text-[#2C3E50]">Cargando murales...</p>}
                    {errorMurales && <p className="text-red-500">Error cargando murales</p>}
                    {murales.length === 0 && !loadingMurales && <p className="text-gray-500">No hay murales disponibles</p>}
                    <ul>
                        {murales.map((m) => {
                            const seleccionado = muralSeleccionado?.id === m.id;
                            return (
                                <li
                                    key={m.id}
                                    onClick={() => setMuralSeleccionado(m)}
                                    className={`cursor-pointer p-2 rounded flex justify-between items-center text-[#2C3E50]
                    ${seleccionado ? "bg-[#4EB9FA]/70 font-bold text-white" : "hover:bg-[#4EB9FA]/20"}`}
                                >
                                    <span>{m.titulo}</span>
                                    {seleccionado && <span className="select-none font-bold text-xl">✔️</span>}
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-[#2C3E50]"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => muralSeleccionado && onConfirm(muralSeleccionado)}
                        disabled={!muralSeleccionado}
                        className={`px-4 py-2 rounded-lg text-white ${muralSeleccionado ? "bg-[#4EB9FA] hover:bg-[#5EBFFA]" : "bg-[#4EB9FA]/50 cursor-not-allowed"
                            }`}
                    >
                        Iniciar con mural
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PopUpMuralSelector;
