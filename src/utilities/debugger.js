import React, { useState, useRef, useEffect } from "react";
import "../CSS/Test.css"

function DebuggerPanel( {customFunction}, {customOutput} ) {
    if (false) {
        return;
    }
    // Popup:
    const [showPopup, setShowPopup] = useState(false);
    const [position, setPosition] = useState({ x: 50, y: 50 });
    const [dragging, setDragging] = useState(false);
    const [clickOffset, setClickOffset] = useState({ x: 0, y: 0 });
    const ref = useRef(null);
    const handleMouseDown = (event) => {
        setDragging(true);
        ref.current.style.cursor = "grabbing";
        event.preventDefault();
        //
        const { clientX, clientY } = event;
        const rect = ref.current.getBoundingClientRect();
        const offsetX = clientX - rect.left;
        const offsetY = clientY - rect.top;
        setClickOffset({ x: offsetX, y: offsetY });
    };
    const handleMouseUp = () => {
        setDragging(false);
        ref.current.style.cursor = "grab";
    };
    const handleMouseMove = (event) => {
        if (!dragging) return;
        event.preventDefault();
        const { clientX, clientY } = event;
        setPosition((prevPosition) => ({
            x: clientX - clickOffset.x,
            y: clientY - clickOffset.y,
        }));
    };
    // Functions:
    function function1() {
        setOutput("Function 1");
    }
    function function2() {
        setOutput("Function 2");
    }
    function function3() {
        setOutput("Function 3");
    }
    // Displays:
    const [output, setOutput] = useState("");
    useEffect(() => {
        const interval = setInterval(() => {
            setOutput(customOutput);
        }, 50);
        return () => {
            clearInterval(interval);
        };
    }, []); 
    // Output:
    return (
        <div
            ref={ref}
            className="debugger-popup"
            style={{ left: position.x, top: position.y, position: 'absolute',
                width: showPopup ? '250px' : '60px', height: showPopup ? '300px' : '80px' }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
        >
            <div className="debugger-popup-content">
                <button className="debugger-popup-button" onClick={() => { setShowPopup(!showPopup) }}>==</button>
                {showPopup && <div>
                        <h2>Debugger Panel</h2>
                        <button className="debugger-popup-button" onClick={function1}>1</button>
                        <button className="debugger-popup-button" onClick={function2}>2</button>
                        <button className="debugger-popup-button" onClick={function3}>3</button>
                        <h2>Custom</h2>
                        <button className="debugger-popup-button" onClick={customFunction}>Custom Function</button>
                        <br></br>
                    <div className="debugger-popup-button">{output}
                    </div>
                </div>}
            </div>
        </div>
    );
};
export default DebuggerPanel;

export class Debugger {
    static customFunctions = new Map();
    static customDisplays = new Map();
    static rerender = false;
    //
    static addFunction(name, func) {
        this.customFunctions.set(name, func);
        this.rerender = true;
    }
    static addDisplay(name, displayFunc) {
        this.customDisplays.set(name, displayFunc);
        this.rerender = true;
    }
    //

}