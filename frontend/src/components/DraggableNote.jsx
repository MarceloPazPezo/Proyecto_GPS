import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";

export default function DraggableNote({
    id,
    title,
    text,
    color,
    position,
    onDelete,
    onUpdate,
}) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
    const [showColorPicker, setShowColorPicker] = useState(false);

    const translateX = position.x + (transform?.x || 0);
    const translateY = position.y + (transform?.y || 0);

    const colorOptions = ["#fef08a", "#fca5a5", "#a5f3fc", "#bbf7d0", "#ddd6fe"];

    const style = {
        transform: `translate3d(${translateX}px, ${translateY}px, 0)`,
        position: "absolute",
        width: 200,
        height: 220,
        backgroundColor: color,
        borderRadius: 8,
        boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
        userSelect: "none",
        display: "flex",
        flexDirection: "column",
    };

    const titleBarStyle = {
        backgroundColor: "#f59e0b",
        padding: "4px 6px",
        display: "flex",
        alignItems: "center",
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        gap: 4,
    };

    const titleInputStyle = {
        background: "transparent",
        border: "none",
        fontWeight: "bold",
        fontSize: 14,
        color: "#2c3e50",
        flexShrink: 1,         // permite encoger si es necesario
        maxWidth: 100,         // máximo ancho para el título
        outline: "none",
        marginRight: 8,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    };

    const dragHandleStyle = {
        display: "grid",
        gridTemplateColumns: "repeat(4, 4px)",
        gridTemplateRows: "repeat(2, 4px)",
        gap: "3px 5px",
        cursor: "grab",
        justifyContent: "center",
        alignItems: "center",
        touchAction: "none",
    };

    const dragDotStyle = {
        width: 4,
        height: 4,
        borderRadius: "50%",
        backgroundColor: "white",
    };

    const iconButtonStyle = {
        background: "transparent",
        border: "none",
        color: "white",
        fontSize: 16,
        cursor: "pointer",
        padding: 2,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            <div style={titleBarStyle}>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => onUpdate(id, { title: e.target.value })}
                    placeholder="Título"
                    style={titleInputStyle}
                />

                <div {...listeners} style={dragHandleStyle} title="Mover">
                    {[0, 1, 2, 3].map((i) => (
                        <div key={`top-${i}`} style={dragDotStyle} />
                    ))}
                    {[null, 0, 1, null].map((val, i) =>
                        val !== null ? (
                            <div key={`bottom-${i}`} style={dragDotStyle} />
                        ) : (
                            <div key={`spacer-${i}`} />
                        )
                    )}
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowColorPicker((prev) => !prev);
                    }}
                    style={iconButtonStyle}
                    title="Cambiar color"
                >
                    🎨
                </button>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(id);
                    }}
                    style={iconButtonStyle}
                    title="Eliminar nota"
                >
                    ×
                </button>
            </div>

            <textarea
                style={{
                    flex: 1,
                    padding: 10,
                    resize: "none",
                    border: "none",
                    background: "transparent",
                    fontSize: 15,
                    outline: "none",
                    fontFamily: "inherit",
                    color: "#2c3e50",
                }}
                value={text}
                onChange={(e) => onUpdate(id, { text: e.target.value })}
            />

            {showColorPicker && (
                <div
                    style={{
                        display: "flex",
                        gap: 6,
                        padding: 6,
                        background: "#fff",
                        borderRadius: 6,
                        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                        position: "absolute",
                        top: 34,
                        right: 10,
                        zIndex: 10,
                    }}
                >
                    {colorOptions.map((col) => (
                        <button
                            key={col}
                            onClick={() => {
                                onUpdate(id, { color: col });
                                setShowColorPicker(false);
                            }}
                            style={{
                                backgroundColor: col,
                                width: 20,
                                height: 20,
                                borderRadius: "50%",
                                border: "1px solid #999",
                                cursor: "pointer",
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
