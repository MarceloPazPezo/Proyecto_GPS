import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DraggableNote from "../components/DraggableNote";
import { DndContext } from "@dnd-kit/core";
import { crearNota, saveMuralFront, getNotesByMural, deleteNoteFront } from "../services/stickNotes.service";
import { useNavigate } from "react-router-dom";
import { showErrorAlert, showSuccessAlert } from "../helpers/sweetAlert";


const VerpizarraNotas = () => {
    const [notes, setNotes] = useState([]);
    const [saving, setSaving] = useState(false);
    const { idMural } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const response = await getNotesByMural(idMural);
                const rawNotes = Array.isArray(response) ? response : [];
                const formattedNotes = rawNotes.map(note => ({
                    id: note.id,
                    title: note.titulo,
                    text: note.descripcion,
                    color: note.color,
                    position: { x: note.posx ?? 0, y: note.posy ?? 0 },
                    idMural: idMural,
                }));
                setNotes(formattedNotes);
            } catch (error) {
                console.error("Error cargando notas:", error);
            }
        };
        fetchNotes();
    }, [idMural]);

    const addNote = async () => {
        const newNoteData = {
            titulo: "Título",
            descripcion: "Nueva nota",
            color: "#fef08a",
            posx: 0,
            posy: 0,
            idMural: idMural,
        };

        try {
            const response = await crearNota(newNoteData);
            const createdNote = response.data;

            if (!createdNote || !createdNote.id) {
                console.error("La nota creada no tiene ID");
                return;
            }

            const newNote = {
                id: createdNote.id,
                title: createdNote.titulo,
                text: createdNote.descripcion,
                color: createdNote.color,
                position: { x: createdNote.posx ?? 0, y: createdNote.posy ?? 0 },
                idMural: idMural,
            };

            setNotes((prev) => [...prev, newNote]);
        } catch (error) {
            console.error("Error creando nota:", error);
        }
    };
    const saveMural = async () => {
        setSaving(true);
        try {
            const formattedNotesForBackend = notes.map(note => ({
                id: note.id,
                titulo: note.title ?? "Titulo",
                descripcion: note.text ?? "Nueva Nota",
                color: note.color ?? "#fef08a",
                posx: note.position?.x ?? 0,
                posy: note.position?.y ?? 0,
                idMural: idMural,
            }));

            await saveMuralFront(idMural, formattedNotesForBackend);
        } catch (error) {
            console.error("Error guardando mural:", error);
        }
        setSaving(false);
    };
    const saveMuralclick = async () => {
        setSaving(true);
        try {
            const formattedNotesForBackend = notes.map(note => ({
                id: note.id,
                titulo: note.title ?? "Titulo",
                descripcion: note.text ?? "Nueva Nota",
                color: note.color ?? "#fef08a",
                posx: note.position?.x ?? 0,
                posy: note.position?.y ?? 0,
                idMural: idMural,
            }));

            await saveMuralFront(idMural, formattedNotesForBackend);

            showSuccessAlert("Mural guardado", "El mural se a guarado correctamente");
        } catch (error) {
            console.error("Error guardando mural:", error);
            showErrorAlert("Error al guardar el mural", error);
        }
        setSaving(false);
    };

    useEffect(() => {
        const autoSaveInterval = setInterval(() => {
            saveMural();
        }, 10 * 1000);

        return () => clearInterval(autoSaveInterval);
    }, [notes]);

    const handleDragEnd = (event) => {
        const { active, delta } = event;

        setNotes((prevNotes) => {
            return prevNotes.map((note) => {
                if (note.id === active.id) {
                    const currentPosition = note.position ?? { x: 0, y: 0 };
                    let newPosition = {
                        x: Math.max(0, currentPosition.x + delta.x),
                        y: Math.max(0, currentPosition.y + delta.y),
                    };

                    const minDx = 210;
                    const minDy = 230;

                    // Máximos desplazamientos en cada dirección
                    let maxOffsetXPos = 0;
                    let maxOffsetXNeg = 0;
                    let maxOffsetYPos = 0;
                    let maxOffsetYNeg = 0;

                    prevNotes.forEach((otherNote) => {
                        if (otherNote.id === note.id) return;

                        const dx = otherNote.position.x - newPosition.x;
                        const dy = otherNote.position.y - newPosition.y;

                        const absDx = Math.abs(dx);
                        const absDy = Math.abs(dy);

                        if (absDx < minDx && absDy < minDy) {
                            const overlapX = minDx - absDx + 5;
                            const overlapY = minDy - absDy + 5;

                            if (dx < 0 && overlapX > maxOffsetXPos) maxOffsetXPos = overlapX;
                            if (dx >= 0 && overlapX > maxOffsetXNeg) maxOffsetXNeg = overlapX;
                            if (dy < 0 && overlapY > maxOffsetYPos) maxOffsetYPos = overlapY;
                            if (dy >= 0 && overlapY > maxOffsetYNeg) maxOffsetYNeg = overlapY;
                        }
                    });

                    // Calculamos desplazamientos en X e Y
                    let offsetX = 0;
                    if (maxOffsetXPos > maxOffsetXNeg) offsetX = maxOffsetXPos;
                    else if (maxOffsetXNeg > 0) offsetX = -maxOffsetXNeg;

                    let offsetY = 0;
                    if (maxOffsetYPos > maxOffsetYNeg) offsetY = maxOffsetYPos;
                    else if (maxOffsetYNeg > 0) offsetY = -maxOffsetYNeg;

                    // Ahora elegimos el eje de mayor desplazamiento y movemos sólo en ese eje
                    if (Math.abs(offsetX) > Math.abs(offsetY)) {
                        newPosition.x = Math.max(0, newPosition.x + offsetX);
                        // Y no cambia
                    } else if (Math.abs(offsetY) > 0) {
                        newPosition.y = Math.max(0, newPosition.y + offsetY);
                        // X no cambia
                    }
                    // Si ambos son 0, no hay solapamiento, no se mueve nada

                    return { ...note, position: newPosition };
                }
                return note;
            });
        });
    };

    const volver = () => {
        navigate("/biblioteca");
    };
    const updateNote = (id, changes) => {
        setNotes((prev) => {
            const updatedNotes = prev.map((note) =>
                note.id === id ? { ...note, ...changes } : note
            );
            return updatedNotes;
        });
    };

    const deleteNote = async (id) => {
        try {
            await deleteNoteFront(id);
            setNotes((prev) => prev.filter((note) => note.id !== id));
        } catch (error) {
            console.error("Error borrando nota:", error);
        }
    };

    return (
        <div className="min-h-screen w-full bg-sky-200 fixed inset-0 overflow-auto">
            <div className="relative min-h-full p-4">
                <DndContext onDragEnd={handleDragEnd}>
                    {notes.map((note) => (
                        <DraggableNote
                            key={note.id}
                            id={note.id}
                            title={note.title}
                            text={note.text}
                            color={note.color}
                            position={note.position ?? { x: 0, y: 0 }}
                            onDelete={deleteNote}
                            onUpdate={updateNote}
                        />
                    ))}

                    <button
                        onClick={addNote}
                        className="fixed bottom-4 left-4 px-4 py-2 bg-green-600 text-white rounded-lg shadow-lg z-50"
                        disabled={saving}
                    >
                        ➕ Nueva Nota
                    </button>

                    <button
                        onClick={saveMuralclick}
                        className="fixed bottom-4 right-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg z-50"
                        disabled={saving}
                    >
                        💾 Guardar mural
                    </button>

                    <button onClick={volver}
                        className="fixed top-4 right-4 px-4 py-2 bg-red-600 text-black rounded-lg shadow-lg z-50">
                        Volver a biblioteca
                    </button>
                </DndContext>
            </div>
        </div>
    );
}

export default VerpizarraNotas;