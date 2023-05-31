import React, { useState, useRef, useEffect } from "react";
import "../CSS/Test.css"
//
import { MessageProcessor } from './messageProcesser.js';
import { StorageManager } from './storageManager.js';
import ObserverComponent from '../components/observer.js';

function DebuggerPanel() {
    if (false) {
        return;
    }
    // Popup:
    const [renderCount, setRenderCount] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const [position, setPosition] = useState({ x: 50, y: 50 });
    const [dragging, setDragging] = useState(false);
    const [clickOffset, setClickOffset] = useState({ x: 0, y: 0 });
    const ref = useRef(null);
    const handleMouseDown = (event) => {
        // Ignore button press:
        if (event.target instanceof HTMLButtonElement) {
            return; 
        }
        // Setup:
        setDragging(true);
        ref.current.style.cursor = "grabbing";
        event.preventDefault();
        // Save click offset:
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
        Debugger.testObj.modify().test.test1 += 1;
    }
    function function2() {
        Debugger.testObj.modify().test.test2 += 1;
    }
    function function3() {
        Debugger.testObj.modify().test= { test1: 3, test2: 3 };
    }
    function rerender() {
        setRenderCount(renderCount + 1);
    }
    function customOutput() {
        return "Output";
    }
    // Test component:
    function Test() {
        return < ObserverComponent dependencies={["testObj.test.test1", "testObj.test.test2"]} Component={() => { 
            useEffect(() => {
                Debugger.testObj.test3++;
            }, []);
            return <div>test.test1: {Debugger.testObj.test.test1}, test.test2:{Debugger.testObj.test.test2}, test3: {Debugger.testObj.test3}</div> }} />
    }
    // Displays:
    const [output, setOutput] = useState("");
    useEffect(() => {
        const interval = setInterval(() => {
            //setOutput(customOutput());
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
                width: showPopup ? '250px' : '60px', height: showPopup ? '300px' : '80px'}}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            key={renderCount}
        >
            <div className="debugger-popup-content">
                <button className="debugger-popup-button" onClick={() => { setShowPopup(!showPopup) }}>==</button>
                {showPopup && <div>
                        <h2>Debugger Panel</h2>
                        <button className="debugger-popup-button" onClick={function1}>1</button>
                        <button className="debugger-popup-button" onClick={function2}>2</button>
                        <button className="debugger-popup-button" onClick={function3}>3</button>
                        <h3>Display</h3>
                        <button className="debugger-popup-button" onClick={rerender}>rerender</button>
                        <br></br>
                        <div className="debugger-popup-button">Display: {output}</div>
                        <br></br>
                        <h3>Component</h3>
                        <Test />
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
    // Testing
    static testObj = StorageManager.createSyncedObject({ test: {test1: 0, test2: 0}, test3: 0 }, "temp", "testObj");

}