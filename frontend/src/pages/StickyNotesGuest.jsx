import React, { useState, useEffect } from "react";
import { DndContext } from "@dnd-kit/core";
import DraggableNote from "../components/DraggableNote";
import { socket } from "../main";

const StickyNotesGuest = () => {
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        // Recibe una nota ya con ID oficial del host
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
            socket.off("addNoteWithId");
            socket.off("updateNote");
            socket.off("deleteNote");
            socket.off("moveNote");
        };
    }, []);

    const addNote = () => {
        const tempNote = {
            title: "Nueva nota",
            text: "",
            color: "#fef08a",
            position: { x: 0, y: 0 },
        };
        socket.emit("addNote", tempNote); // El host le asigna el ID
    };

    const updateNote = (id, changes) => {
        const note = notes.find((n) => n.id === id);
        if (!note) return;

        const updatedNote = { ...note, ...changes };
        socket.emit("updateNote", updatedNote);

        setNotes((prev) =>
            prev.map((n) => (n.id === id ? updatedNote : n))
        );
    };

    const deleteNote = (id) => {
        socket.emit("deleteNote", id);
        setNotes((prev) => prev.filter((note) => note.id !== id));
    };

    const handleDragEnd = (event) => {
        const { active, delta } = event;

        setNotes((notes) =>
            notes.map((note) => {
                if (note.id === active.id) {
                    const pos = note.position || { x: 0, y: 0 };
                    const newPosition = {
                        x: pos.x + delta.x,
                        y: pos.y + delta.y,
                    };

                    socket.emit("moveNote", {
                        id: active.id,
                        position: newPosition,
                    });

                    return { ...note, position: newPosition };
                }
                return note;
            })
        );
    };

    return (
        <DndContext onDragEnd={handleDragEnd}>
            {notes.map((note) => (
                <DraggableNote
                    key={note.id}
                    id={note.id}
                    title={note.title}
                    text={note.text}
                    color={note.color}
                    position={note.position || { x: 0, y: 0 }}
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

export default StickyNotesGuest;
