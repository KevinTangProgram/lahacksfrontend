import React, { useState, useEffect } from 'react';
import Tooltip from './tooltip';
import { MessageProcessor } from '../utilities/messageProcesser';
import { OasisManager } from '../utilities/oasisManager';


function GenerationOptionsUI(options) {
    // UI Title:
    const [topicValue, setTopicValue] = useState(MessageProcessor.generationMenuSettings.topic || options.titleValue);
    const handleTopicChange = (event) => {
        setTopicValue(event.target.value);
    }
    // UI Popups:
    const [showPopup, setShowPopup] = useState(options.openUIByDefault);
    const togglePopup = () => {
        setShowPopup(!showPopup);
        // Setup:
        setShowErrors(false);
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
    const UIStrings = {
        w_m_low: "Warning: Shorter ideas may decrease the quality of generation.",
        w_m_high: "Warning: Each message is counted as a single idea. Split large messages into different ideas?",
        w_o_low: "Warning: A low number of ideas may decrease the quality of generation.",
        w_o_high: "Warning: Too many ideas may result in usage limits being applied.",
        e_not_ready: "Error: There was a problem generating. Please wait a few moments and try again.",
        e_no_messages: "Error: There were no ideas to generate from. Please check your generation settings.",
        e_usage_limit: "Error: Usage limit reached. Please consider upgrading your account.",
        e_in_prog: "Error: A generation is already in process. Please wait a few moments and try again.",
        e_no_topic: "Error: Please enter a topic."
    }


    // UI Generation:
        // Options:
    const [generateOptions, setGenerateOptions] = useState(MessageProcessor.generationMenuSettings);
        // Warnings:
    const [showWarnings, setShowWarnings] = useState(false);
    const [warnings, setWarnings] = useState(MessageProcessor.getGenerationWarnings());
        // Errors/Status:
    const [showErrors, setShowErrors] = useState(false);
    const [errors, setErrors] = useState([]);
    const [generationStatus, setGenerationStatus] = useState(0); // 0: Ready, 1: In Progress, 2: Complete. -2: failed. -1. in progress.

    useEffect(() => {
        setGenerateOptions({
            generateRecent: true,
            startIndex: 0,
            endIndex: 0,
            topic: topicValue,
            mode: sliderValue,
            generateHeaders: checkboxValues.generateHeaders,
            useBulletFormat: checkboxValues.useBulletFormat,
        });
    }, [topicValue, sliderValue, checkboxValues.generateHeaders, checkboxValues.useBulletFormat]);
    const tryGeneration = () => {
        MessageProcessor.generationMenuSettings = generateOptions;
        const result = MessageProcessor.startGenerationWithOptions(generateOptions);
        if (result !== 1) {
            setErrors(result);
            setShowErrors(true);
        }
        setGenerationStatus(MessageProcessor.generationStatus);
    }
    // Interval Checks:
    useEffect(() => {
        const interval = setInterval(() => {
            const statusCode = MessageProcessor.generationStatus;
            setGenerationStatus(statusCode)
            if (statusCode === 2) {
                setShowPopup(false);
                MessageProcessor.generationStatus = 0;
            }
            setWarnings(MessageProcessor.getGenerationWarnings());
        }, 1000);
        // Cleanup function to clear the interval
        return () => clearInterval(interval);
    }, []);
    
    // Persistent UI:


    // Output:
    return (
        <div className="generationOptionsMenu alignCenter">
            <button onClick={togglePopup}>===</button>
            {showPopup &&
                <div className="generationOptionsUI">
                    <button onClick={togglePopup}>===</button>
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
                        <button className={warnings.length === 0 ? 'lowOpacity' : ''} onClick={() => setShowWarnings(!showWarnings)}>Show Warnings ({warnings.length})</button>
                    {showWarnings && 
                        <div id="generateUIWarnings">
                            <ul>
                                    {warnings.map((warning, index) => (
                                        <li key={index}>{UIStrings[warning] || null}</li>
                                ))}
                            </ul>
                        </div>
                    }
                    {/* GENERATE BUTTON */}
                        {showErrors &&
                            <div id="generateUIErrors">
                                <ul>
                                    {errors.map((error, index) => (
                                        <li key={index}>{UIStrings[error] || null}</li>
                                    ))}
                                </ul>
                            </div>
                        }
                    <button className={generationStatus === 1 ? 'lowOpacity' : ''} onClick={() => {
                            if (generationStatus !== 1) {
                                tryGeneration();
                            }
                    }}>Generate</button>
                    {
                        generationStatus === 1 ? (<p>Generating with mode X{generateOptions.mode} ...</p>) : null
                    }
                </div>
                </div>
            }
        </div>
    );
}




export default GenerationOptionsUI;