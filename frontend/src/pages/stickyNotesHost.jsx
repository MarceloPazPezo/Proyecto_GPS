import { useState, useEffect, useRef } from "react";
import { DndContext } from "@dnd-kit/core";
import DraggableNote from "../components/DraggableNote";
import { socket } from "../main";
import { useParams } from "react-router-dom";
import { crearNota, saveMuralFront, getNotesByMural, deleteNoteFront } from "../services/stickNotes.service";
import { useNavigate } from "react-router-dom";

const StickyNotesHost = () => {
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
            socket.emit("addNoteWithId", newNote);
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

            socket.emit("syncNotes", notes);
        } catch (error) {
            console.error("Error guardando mural:", error);
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

        setNotes((prevNotes) =>
            prevNotes.map((note) => {
                if (note.id === active.id) {
                    const currentPosition = note.position ?? { x: 0, y: 0 };
                    const newPosition = {
                        x: currentPosition.x + delta.x,
                        y: currentPosition.y + delta.y,
                    };
                    socket.emit("moveNote", { id: note.id, position: newPosition });
                    return { ...note, position: newPosition };
                }
                return note;
            })
        );
    };

    const finalizarAct = () => {
        socket.emit("finnish", { sala: sessionStorage.getItem('sala') });
        sessionStorage.removeItem("sala");
        sessionStorage.removeItem("participantes");
        navigate("/room");
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

    const deleteNote = async (id) => {
        try {
            await deleteNoteFront(id);
            setNotes((prev) => prev.filter((note) => note.id !== id));
            socket.emit("deleteNote", id);
        } catch (error) {
            console.error("Error borrando nota:", error);
        }
    };

    useEffect(() => {
        socket.on("addNote", async (noteWithoutId) => {
            try {
                const response = await crearNota(noteWithoutId); // crea nota en DB y recibe la nota con UUID
                const createdNote = response.data;

                if (!createdNote || !createdNote.id) {
                    console.error("La nota creada no tiene ID");
                    return;
                }

                const noteWithId = {
                    ...createdNote,
                    position: { x: createdNote.posx ?? 0, y: createdNote.posy ?? 0 },
                };

                setNotes((prev) => [...prev, noteWithId]);
                socket.emit("addNoteWithId", noteWithId);

            } catch (error) {
                console.error("Error creando nota en socket addNote:", error);
            }
        });

        socket.on("addNoteWithId", (note) => {
            setNotes((prev) => [...prev, {
                ...note,
                position: note.position ?? { x: 0, y: 0 }
            }]);
        });

        socket.on("updateNote", (updatedNote) => {
            setNotes((prev) =>
                prev.map((note) =>
                    note.id === updatedNote.id
                        ? { ...note, ...updatedNote, position: updatedNote.position ?? note.position ?? { x: 0, y: 0 } }
                        : note
                )
            );
        });

        socket.on("requestDeleteNote", (noteId) => {
            deleteNote(noteId);
        });

        socket.on("moveNote", ({ id, position }) => {
            setNotes((prev) =>
                prev.map((note) =>
                    note.id === id ? { ...note, position: position ?? { x: 0, y: 0 } } : note
                )
            );
        });

        socket.on("syncNotes", (savedNotes) => {
            const formatted = savedNotes.map(note => ({
                ...note,
                position: note.position ?? { x: 0, y: 0 }
            }));
            setNotes(formatted);
        });

        return () => {
            socket.off("addNote");
            socket.off("addNoteWithId");
            socket.off("updateNote");
            socket.off("deleteNote");
            socket.off("moveNote");
            socket.off("syncNotes");
        };
    }, []);

    return (
        
         <div className="h-screen bg-sky-200 ">
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
                onClick={saveMural}
                className="fixed bottom-4 right-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg z-50"
                disabled={saving}
            >
                💾 Guardar mural
            </button>

            <button onClick={finalizarAct}
                    className="fixed top-4 right-4 px-4 py-2 bg-red-600 text-black rounded-lg shadow-lg z-50">
                    Terminar Actividad
                </button>
        </DndContext>
        </div>
    );
};

export default StickyNotesHost;
