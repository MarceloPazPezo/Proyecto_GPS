import { useState, useEffect, useRef } from "react";
import { DndContext } from "@dnd-kit/core";
import DraggableNote from "../components/DraggableNote";
import { socket } from "../main";

const StickyNotesHost = () => {
    const [notes, setNotes] = useState([]);
    const noteCounter = useRef(1);

    const addNote = () => {
        const newId = `note-${noteCounter.current++}`;
        const newNote = {
            id: newId,
            title: "Título",
            text: "Nueva nota",
            color: "#fef08a",
            position: { x: 0, y: 0 },
        };
        setNotes((prev) => [...prev, newNote]);
        socket.emit("addNoteWithId", newNote); // solo enviar ya con ID
    };

    const handleDragEnd = (event) => {
        const { active, delta } = event;

        setNotes((prevNotes) =>
            prevNotes.map((note) => {
                if (note.id === active.id) {
                    const newPosition = {
                        x: note.position.x + delta.x,
                        y: note.position.y + delta.y,
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

    const deleteNote = (id) => {
        setNotes((prev) => prev.filter((note) => note.id !== id));
        socket.emit("deleteNote", id);
    };

    useEffect(() => {
        // Cuando un invitado solicita crear una nota (sin ID)
        socket.on("addNote", (noteWithoutId) => {
            const newId = `note-${noteCounter.current++}`;
            const noteWithId = { ...noteWithoutId, id: newId };
            setNotes((prev) => [...prev, noteWithId]);
            socket.emit("addNoteWithId", noteWithId); // reenviar con ID oficial
        });

        // Cuando alguien recibe una nota con ID ya asignada
        socket.on("addNoteWithId", (note) => {
            setNotes((prev) => [...prev, note]);
        });

        socket.on("updateNote", (updatedNote) => {
            setNotes((prev) =>
                prev.map((note) =>
                    note.id === updatedNote.id ? { ...note, ...updatedNote } : note
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

        return () => {
            socket.off("addNote");
            socket.off("addNoteWithId");
            socket.off("updateNote");
            socket.off("deleteNote");
            socket.off("moveNote");
        };
    }, []);

    return (
        <DndContext onDragEnd={handleDragEnd}>
            {notes.map((note) => (
                <DraggableNote
                    key={note.id}
                    id={note.id}
                    title={note.title}
                    text={note.text}
                    color={note.color}
                    position={note.position}
                    onDelete={deleteNote}
                    onUpdate={updateNote}
                />
            ))}
    
            <button
                onClick={addNote}
                className="fixed bottom-4 left-4 px-4 py-2 bg-green-600 text-white rounded-lg shadow-lg z-50"
            >
                ➕ Nueva Nota
            </button>
        </DndContext>
    );
};

export default StickyNotesHost;
