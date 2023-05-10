import React, { useState } from 'react';
import Tooltip from './tooltip';
import { MessageProcessor } from '../utilities/messageProcesserFrontend';

var options;


function GenerationOptionsUI() {
    // UI Popups:
    const [showPopup, setShowPopup] = useState(false);
    const togglePopup = () => {
        setShowPopup(!showPopup);
    }
    // UI Sliders:
    const [showCheckBoxHeaders, setShowCheckBoxHeaders] = useState(false);
    const [showCheckBoxBullet, setShowCheckBoxBullet] = useState(false);
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
        if (newValue === 1) {
            setShowCheckBoxHeaders(false);
            setShowCheckBoxBullet(false);
            setGenerateDescElement(
                <div>
                    <p>Format</p>
                    <Tooltip text={"Keep original ideas and order intact."} />
                </div>
                );
        }
        if (newValue === 2) {
            setShowCheckBoxHeaders(true);
            setShowCheckBoxBullet(false);
            setGenerateDescElement(
                <div>
                    <p>Polish</p>
                    <Tooltip text={"Polish grammar/wording."} />
                </div>
            );
        }
        if (newValue === 3) {
            setShowCheckBoxHeaders(false);
            setShowCheckBoxBullet(true);
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
        useBulletFormat: false,
    });
    const handleCheckboxChange = (event) => {
        setCheckboxValues({
            ...checkboxValues,
            [event.target.name]: event.target.checked,
        })
    };
    // UI Warnings:
    const warningMessageContentTooLow = 
        "Warning: Low content per message decreases the effectiveness of AI-enabled formatting."
    const warningMessageContentTooHigh =
        <div>Warning: Each message is counted as a single thought. Split large messages into different thoughts?</div>
    const warningNoteContentTooLow =
        <div>Warning: A lower number of messages decreases the effectiveness of AI-enabled formatting.</div>
    const warningNoteContentTooHigh =
        <div>Warning: Too many messages may result in usage limits being applied.</div>
    const warningStrings = { warningMessageContentTooLow, warningMessageContentTooHigh, warningNoteContentTooLow, warningNoteContentTooHigh };

    // UI Generation:
    const [showWarnings, setShowWarnings] = useState(false);
    const tryGeneration = (forceGenerate = false) => {
        options = {
            mode: sliderValue,
            generateHeaders: checkboxValues.generateHeaders,
            useBulletFormat: checkboxValues.useBulletFormat,
        };
        const warnings = MessageProcessor.getGenerationWarnings(options);
        if (warnings.length < 0 || forceGenerate) {
            MessageProcessor.startGenerationWithOptions(options);
        }
        else {
            setShowWarnings(true);
        }
    }

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
                            min="1"
                            max="3"
                            step="1"
                            defaultValue={sliderValue}
                            onChange={handleSliderChange}
                        />
                    </div>
                    {/* CHECKBOXES */}
                    {showCheckBoxHeaders  && 
                    <div id="checkboxGenerateHeaders">
                        <p>Generate Headers:</p>
                        <input
                            type="checkbox"
                            name="generateHeaders"
                            checked={checkboxValues.generateHeaders}
                            onChange={handleCheckboxChange}
                        />
                    </div> 
                    }
                    {showCheckBoxBullet && 
                        <div id="checkboxUseBulletFormat">
                        <p>Use Bullet Format:</p>
                        <input
                            type="checkbox"
                                name="useBulletFormat"
                                checked={checkboxValues.useBulletFormat}
                            onChange={handleCheckboxChange}
                        />
                    </div>
                    }
                    {/* WARNINGS */}
                    {showWarnings && 
                        <div id="generateUIWarnings">
                            <ul>
                                {MessageProcessor.queueGenerationWithOptions(options).map((warning, index) => (
                                    warning === "o_low" ? <li key={index}>{warningStrings.warningNoteContentTooLow}</li> :
                                    warning === "o_high" ? <li key={index}>{warningStrings.warningNoteContentTooHigh}</li> :
                                    warning === "m_low" ? <li key={index}>{warningStrings.warningMessageContentTooLow}</li> :
                                    warning === "m_high" ? <li key={index}>{warningStrings.warningMessageContentTooHigh}</li> : null
                                ))}
                            </ul>
                            <button onClick={() => tryGeneration(true)}>CONTINUE</button>
                        </div>
                    }
                    {/* GENERATE BUTTON */}
                    <button onClick={() => tryGeneration(false)}>GENERATE NOW</button>
                </div>
            }
        </div>
    );
}




export default GenerationOptionsUI;