import { useState, useEffect } from "react";
import { DndContext } from "@dnd-kit/core";
import DraggableNote from "../components/DraggableNote";
import { socket } from "../main";
import { getNotesByMural } from "../services/stickNotes.service";
import { useNavigate } from "react-router-dom";
import fondoSVG from '../assets/fondo_azul.svg';
import { censurarTexto } from "../helpers/censoredtext";

const StickyNotesGuest = () => {
    const [notes, setNotes] = useState([]);
    const [idMuralGuest, setIdMuralGuest] = useState(null);
    const navigate = useNavigate();

    const formatNote = (note, idMural) => ({
        id: note.id,
        title: note.titulo ?? note.title ?? "Título",
        text: note.descripcion ?? note.text ?? "Nueva nota",
        color: note.color ?? "#fef08a",
        position: {
            x: note.posx ?? note.position?.x ?? 0,
            y: note.posy ?? note.position?.y ?? 0,
        },
        idMural: idMural,
    });

    useEffect(() => {
        socket.on("enviarIdMural", (idMural) => {
            if (!idMuralGuest) {
                const muralId = typeof idMural === "object" ? idMural.idMural : idMural;
                setIdMuralGuest(muralId);
            }
        });

        return () => {
            socket.off("enviarIdMural");
        };
    }, [idMuralGuest]);

    useEffect(() => {
        if (!idMuralGuest) return;

        const fetchNotes = async () => {
            try {
                const response = await getNotesByMural(idMuralGuest);
                const formattedNotes = Array.isArray(response)
                    ? response.map(note => formatNote(note, idMuralGuest))
                    : [];
                setNotes(formattedNotes);
            } catch (error) {
                console.error("Error cargando notas invitado:", error);
            }
        };

        fetchNotes();
    }, [idMuralGuest]);

    const finalizeQuiz = () => {
        sessionStorage.removeItem('sala');
        navigate("/join");
    };

    useEffect(() => {
        socket.on("addNoteWithId", (note) => {
            setNotes((prev) => {
                if (prev.find((n) => n.id === note.id)) return prev;
                return [...prev, note];
            });
        });

        socket.on("finnish", finalizeQuiz);

        socket.on("updateNote", (updatedNote) => {
            setNotes((prev) =>
                prev.map((note) =>
                    note.id === updatedNote.id
                        ? {
                            ...note,
                            title: censurarTexto(updatedNote.title ?? note.title),
                            text: censurarTexto(updatedNote.text ?? note.text),
                            color: updatedNote.color ?? note.color,
                            position: updatedNote.position ?? note.position,
                        }
                        : note
                )
            );
        });

        socket.on("deleteNote", (id) => {
            setNotes((prev) => prev.filter((note) => note.id !== id));
        });

        socket.on("moveNote", ({ id, position }) => {
            setNotes((prev) =>
                prev.map((note) =>
                    note.id === id ? { ...note, position } : note
                )
            );
        });

        socket.on("syncNotes", (savedNotes) => {
            setNotes(savedNotes.map(note => formatNote(note, idMuralGuest)));
        });

        return () => {
            socket.off("addNoteWithId");
            socket.off("updateNote");
            socket.off("deleteNote");
            socket.off("moveNote");
            socket.off("syncNotes");
        };
    }, [idMuralGuest]);

    const getFreePosition = (existingNotes, spacing = 200) => {
        const maxTries = 100;
        for (let i = 0; i < maxTries; i++) {
            const x = (i % 5) * spacing;
            const y = Math.floor(i / 5) * spacing;
            const overlaps = existingNotes.some(note => {
                const dx = Math.abs(note.position.x - x);
                const dy = Math.abs(note.position.y - y);
                return dx < spacing && dy < spacing;
            });
            if (!overlaps) return { x, y };
        }
        return { x: 0, y: 0 };
    };

    const addNote = () => {
        if (!idMuralGuest) return;
        const position = getFreePosition(notes);
        const tempNote = {
            titulo: "Título",
            descripcion: "Nueva nota",
            color: "#fef08a",
            posx: position.x,
            posy: position.y,
            idMural: idMuralGuest,
        };
        socket.emit("addNote", tempNote);
    };

    const requestDeleteNote = (noteId) => {
        socket.emit("requestDeleteNote", noteId);
    };

    const handleDragEnd = (event) => {
        const { active, delta } = event;

        setNotes((prevNotes) => {
            return prevNotes.map((note) => {
                if (note.id === active.id) {
                    const currentPosition = note.position ?? { x: 0, y: 0 };
                    let newPosition = {
                        x: currentPosition.x + delta.x,
                        y: currentPosition.y + delta.y,
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

                    socket.emit("moveNote", {
                        id: note.id,
                        position: newPosition,
                    });

                    return { ...note, position: newPosition };
                }
                return note;
            });
        });
    };

    // Aquí está la función updateNote con censura aplicada antes de actualizar estado y emitir
    const updateNote = (id, changes) => {
        setNotes((prev) => {
            const updatedNotes = prev.map((note) =>
                note.id === id
                    ? {
                        ...note,
                        ...changes,
                        title: changes.title !== undefined ? censurarTexto(changes.title) : note.title,
                        text: changes.text !== undefined ? censurarTexto(changes.text) : note.text,
                    }
                    : note
            );
            const updatedNote = updatedNotes.find((note) => note.id === id);
            socket.emit("updateNote", updatedNote);
            return updatedNotes;
        });
    };

    if (!idMuralGuest) {
        return (
            <main
                className="flex items-center justify-center min-h-screen w-full p-4"
                style={{
                    backgroundImage: `url(${fondoSVG})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                <div className="w-full max-w-md bg-white/80 backdrop-blur-lg border border-[#2C3E50]/20 shadow-xl rounded-2xl p-8 text-center flex flex-col items-center gap-6">
                    <div
                        className="w-16 h-16 animate-spin rounded-full border-4 border-dashed border-[#4EB9FA]"
                        role="status"
                        aria-label="Cargando"
                    ></div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#2C3E50]">
                        Sala de Espera
                    </h1>
                    <p className="text-base text-[#2C3E50]/80">
                        Por favor, espera a que el anfitrión inicie la actividad.
                    </p>
                </div>
            </main>
        );
    }

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
                            position={note.position || { x: 0, y: 0 }}
                            onUpdate={updateNote}
                            onDelete={() => requestDeleteNote(note.id)}
                        />
                    ))}

                    <button
                        onClick={addNote}
                        className="fixed bottom-4 left-4 px-4 py-2 bg-green-600 text-white rounded-lg shadow-lg z-50"
                    >
                        ➕ Nueva Nota
                    </button>
                </DndContext>
            </div>
        </div>
    );
};

export default StickyNotesGuest;
