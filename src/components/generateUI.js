import React, { useState, useEffect } from 'react';
import Tooltip from './tooltip';
import { MessageProcessor } from '../utilities/messageProcesser';


function GenerationOptionsUI(options) {
    // UI Title:
    const [topicValue, setTopicValue] = useState(options.titleValue);
    const handleTopicChange = (event) => {
        setTopicValue(event.target.value);
    }
    // UI Popups:
    const [showPopup, setShowPopup] = useState(options.openUIByDefault);
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
        "Warning: Low content per message decreases the quality of generation."
    const warningMessageContentTooHigh =
        "Warning: Each message is counted as a single thought. Split large messages into different thoughts?"
    const warningNoteContentTooLow =
        "Warning: A low number of messages may decrease the quality of generation."
    const warningNoteContentTooHigh =
        "Warning: Too many messages may result in usage limits being applied."
    const warningStrings = { warningMessageContentTooLow, warningMessageContentTooHigh, warningNoteContentTooLow, warningNoteContentTooHigh };

    // UI Generation:
    const [generateOptions, setGenerateOptions] = useState({
        mode: 0,
        generateHeaders: false,
        useBulletFormat: false,
    });
    const [showWarnings, setShowWarnings] = useState(false);
    const tryGeneration = (forceGenerate = false) => {
        setGenerateOptions({
            mode: sliderValue,
            generateHeaders: checkboxValues.generateHeaders,
            useBulletFormat: checkboxValues.useBulletFormat,
        });
        const warnings = MessageProcessor.getGenerationWarnings();
        if (warnings.length <= 0 || forceGenerate) {
            setShowWarnings(false);
            MessageProcessor.startGenerationWithOptions(options);
        }
        else if (MessageProcessor.generationStatus === 0){
            setShowWarnings(true);
        }
        setGenerationStatus(MessageProcessor.generationStatus);
    }
    const [generationStatus, setGenerationStatus] = useState(0);
    // -2: Error: generation failed
    // -1: Error: generation already in progress
    //  0:  Ready to generate
    //  1:  Generation in progress
    //  2: Generation complete
    useEffect(() => {
        const interval = setInterval(() => {
            const statusCode = MessageProcessor.generationStatus;
            setGenerationStatus(statusCode)
            if (statusCode === 2) {
                setShowPopup(false);
                MessageProcessor.generationStatus = 0;
            }
        }, 1000);
        // Cleanup function to clear the interval
        return () => clearInterval(interval);
    }, []);

    // Output:
    return (
        <div className="generationOptionsUI">
        <div className="alignCenter">
            <button onClick={togglePopup}>===</button>
            {showPopup &&
                <div className="generationOptions">
                    <h2>Generation Options</h2>
                    {/* TITLE */}
                    <div id="optionTitle">
                        <p>Topic: </p>
                        <input
                            type="text"
                            name="Title"
                            defaultValue={options.titleValue}
                            onChange={handleTopicChange}
                        />
                    </div>
                    {/* SLIDER */}
                    <div id="optionSlider">
                        <p>Mode: </p>
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
                                {MessageProcessor.getGenerationWarnings().map((warning, index) => (
                                    warning === "o_low" ? <li key={index}>{warningStrings.warningNoteContentTooLow}</li> :
                                    warning === "o_high" ? <li key={index}>{warningStrings.warningNoteContentTooHigh}</li> :
                                    warning === "m_low" ? <li key={index}>{warningStrings.warningMessageContentTooLow}</li> :
                                    warning === "m_high" ? <li key={index}>{warningStrings.warningMessageContentTooHigh}</li> : null
                                ))}
                            </ul>
                            <button onClick={() => tryGeneration(true)}>Continue</button>
                        </div>
                    }
                    {/* GENERATE BUTTON */}
                    {!showWarnings &&
                            <button className={generationStatus !==0 ? 'lowOpacity' : ''} onClick={() => tryGeneration(false)}>Generate</button>
                    }
                    {
                        generationStatus === -1 ? (<p>A generation is already in process. Please wait a few moments and try again.</p>) :
                        generationStatus === 1 ? (<p>Generating with mode X{generateOptions.mode} ...</p>) : null
                    }
                </div>
            }
        </div>
        </div>
    );
}




export default GenerationOptionsUI;