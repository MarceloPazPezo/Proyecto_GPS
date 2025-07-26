import { useState, useEffect } from "react";
import { DndContext } from "@dnd-kit/core";
import DraggableNote from "../components/DraggableNote";
import { socket } from "../main";
import { getNotesByMural } from "../services/stickNotes.service";
import { useNavigate } from "react-router-dom";
import fondoSVG from '../assets/fondo_azul.svg';

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
    }, []);

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
                            title: updatedNote.title ?? note.title,
                            text: updatedNote.text ?? note.text,
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

    const addNote = () => {
        if (!idMuralGuest) return;
        const tempNote = {
            titulo: "Título",
            descripcion: "Nueva nota",
            color: "#fef08a",
            posx: 0,
            posy: 0,
            idMural: idMuralGuest,
        };
        socket.emit("addNote", tempNote);
    };

    const requestDeleteNote = (noteId) => {
        socket.emit("requestDeleteNote", noteId);
    };

    const handleDragEnd = (event) => {
        const { active, delta } = event;
        setNotes((prevNotes) =>
            prevNotes.map((note) => {
                if (note.id === active.id) {
                    const newPosition = {
                        x: note.position?.x + delta.x,
                        y: note.position?.y + delta.y,
                    };
                    socket.emit("moveNote", { id: note.id, position: newPosition });
                    return { ...note, position: newPosition };
                }
                return note;
            })
        );
    };

    const updateNote = (id, changes) => {
        setNotes((prev) => {
            const updatedNotes = prev.map((note) =>
                note.id === id ? { ...note, ...changes } : note
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

        )
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
