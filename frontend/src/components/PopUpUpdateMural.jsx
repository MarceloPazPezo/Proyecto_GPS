import { useState } from "react";

const PopUpUpdateMural = ({ isOpen, onClose, onSave, tituloActual }) => {
    const [titulo, setTitulo] = useState(tituloActual || "");

    const handleSave = () => {
        onSave(titulo);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
                <h2 className="text-xl font-semibold mb-4 text-[#2C3E50]">Editar Título del Mural</h2>
                <input
                    type="text"
                    className="w-full border border-[#ECEDF2] rounded-lg px-4 py-2 mb-4 text-black focus:outline-none focus:ring-2 focus:ring-[#4EB9FA]"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                    <button
                        className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-[#2C3E50]"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                    <button
                        className="px-4 py-2 rounded-lg bg-[#4EB9FA] hover:bg-[#5EBFFA] text-white font-semibold"
                        onClick={handleSave}
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PopUpUpdateMural;