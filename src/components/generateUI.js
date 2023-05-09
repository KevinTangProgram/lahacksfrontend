import React, { useState } from 'react';
import Tooltip from './tooltip';

function GenerationOptionsUI() {
    // UI Popups:
    const [showPopup, setShowPopup] = useState(false);
    const togglePopup = () => {
        setShowPopup(!showPopup);
    }
    // UI Sliders:
    const [showCBMark, setShowCBMark] = useState(false);
    const [sliderValue, setSliderValue] = useState(0);
    const [generateDescElement, setGenerateDescElement] = useState(
        <div>
            <p>Auto-Format</p>
            <Tooltip text={"Keep original ideas and order intact."} />
        </div>
    );
    const handleSliderChange = (event) => {
        const newValue = parseInt(event.target.value);
        setSliderValue(newValue);
        if (newValue === 0) {
            setShowCBMark(false);
            setGenerateDescElement(
                <div>
                    <p>Format</p>
                    <Tooltip text={"Keep original ideas and order intact."} />
                </div>
                );
        }
        if (newValue === 1) {
            setShowCBMark(false);
            setGenerateDescElement(
                <div>
                    <p>Organize</p>
                    <Tooltip text={"Keep original wording."} />
                </div>
                );
        }
        if (newValue === 2) {
            setShowCBMark(true);
            setGenerateDescElement(
                <div>
                    <p>Polish</p>
                    <Tooltip text={"Polish grammar/wording."} />
                </div>
            );
        }
        if (newValue === 3) {
            setShowCBMark(true);
            setGenerateDescElement(
                <div>
                    <p>Elaborate</p>
                    <Tooltip text={"Elaborate on existing ideas. Results may vary."} />
                </div>
            );
        }
    };
    // UI Checkboxes:
    const [checkboxValues, setCheckboxValues] = useState({
        generateHeaders: false,
        markUnclearMessages: false,
    });
    const handleCheckboxChange = (event) => {
        setCheckboxValues({
            ...checkboxValues,
            [event.target.name]: event.target.checked,
        })
    };
    // UI Warnings:
    const warningMessageContentTooLow = 
        <div>Warning: Low content per message decreases the effectiveness of AI-enabled formatting.</div>
    const warningMessageContentTooHigh =
        <div>Warning: Each message is counted as a single thought. Split large messages into different thoughts?</div>
    const warningNoteContentTooLow =
        <div>Warning: A lower number of messages decreases the effectiveness of AI-enabled formatting.</div>
    const warningNoteContentTooHigh =
        <div>Warning: Too many messages may result in usage limits being applied.</div>


    // Output:
    return (
        <div className="alignCenter">
            <button onClick={togglePopup}>Generate</button>
            {showPopup &&
                <div className="generationOptionsUI">
                    <h2>Generation Options</h2>
                    {/* TITLE */}
                    <div id="optionTitle">
                        <p>Topic: (default is title of message conversation) </p>
                        <input
                            type="text"
                            name="Title"
                        />
                    </div>
                    {/* SLIDER */}
                    <div id="optionSlider">
                        <p>Generate Mode:</p>
                        {generateDescElement}
                        <input
                            type="range"
                            min="0"
                            max="3"
                            step="1"
                            defaultValue={sliderValue}
                            onChange={handleSliderChange}
                        />
                    </div>
                    {/* CHECKBOXES */}
                    <div id="checkboxGenerateHeaders">
                        <p>Generate Headers:</p>
                        <input
                            type="checkbox"
                            name="generateHeaders"
                            checked={checkboxValues.generateHeaders}
                            onChange={handleCheckboxChange}
                        />
                    </div>
                    {showCBMark && 
                    <div id="checkboxMarkUnclearMessages">
                        <p>Mark Unclear Messages:</p>
                        <input
                            type="checkbox"
                            name="markUnclearMessages"
                            checked={checkboxValues.markUnclearMessages}
                            onChange={handleCheckboxChange}
                        />
                    </div>
                    }
                    {/* WARNINGS */}
                    {(sliderValue === 2 || sliderValue === 3) && warningMessageContentTooLow}
                    {(sliderValue === 2 || sliderValue === 3) && warningNoteContentTooLow}
                    {warningMessageContentTooHigh}
                    {warningNoteContentTooHigh}
                    <button onClick={togglePopup}>GENERATE NOW</button>
                </div>
            }
        </div>
    );
}

export default GenerationOptionsUI;