import React, { useState } from "react";
import { DndContext } from "@dnd-kit/core";
import DraggableNote from "../components/DraggableNote";
import { socket } from "../main";

const StickyNotesHost = () => {
    const [notes, setNotes] = useState([
        {
            id: "note-1",
            title: "Título 1",
            text: "Primera nota",
            color: "#fef08a", 
            position: { x: 0, y: 0 },
        },
    ]);

    const addNote = () => {
        const newId = `note-${notes.length + 1}`;
        setNotes([
            ...notes,
            {
                id: newId,
                title: `Título ${notes.length + 1}`,
                text: `Nueva nota ${notes.length + 1}`,
                color: "#fef08a",
                position: { x: 0, y: 0 },
            },
        ]);
    };

    const handleDragEnd = (event) => {
        const { active, delta } = event;

        setNotes((notes) =>
            notes.map((note) => {
                if (note.id === active.id) {
                    return {
                        ...note,
                        position: {
                            x: note.position.x + delta.x,
                            y: note.position.y + delta.y,
                        },
                    };
                }
                return note;
            })
        );
    };

    const updateNote = (id, changes) => {
        setNotes((prev) =>
            prev.map((note) => (note.id === id ? { ...note, ...changes } : note))
        );
    };

    const deleteNote = (id) => {
        setNotes((notes) => notes.filter((note) => note.id !== id));
    };

    const handleTextChange = (id, newText) => {
        setNotes((notes) =>
            notes.map((note) =>
                note.id === id ? { ...note, text: newText } : note
            )
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