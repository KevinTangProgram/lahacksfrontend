import React, { useState } from "react";

const Debugger = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleDragStart = (event) => {
        const { clientX, clientY } = event;
        setPosition({ x: clientX, y: clientY });
    };

    const handleDrag = (event) => {
        const { clientX, clientY } = event;
        const offsetX = clientX - position.x;
        const offsetY = clientY - position.y;
        setPosition((prevPosition) => ({
            x: prevPosition.x + offsetX,
            y: prevPosition.y + offsetY,
        }));
    };

    return (
        <div
            className="debugger-popup"
            style={{ left: position.x, top: position.y }}
            draggable
            onDragStart={handleDragStart}
            onDrag={handleDrag}>

            <div>
                <h2>Debugger Panel</h2>
                <p>Content goes here...</p>
            </div>
            
        </div>
    );
};

export default Debugger;
