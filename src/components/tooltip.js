import React, { useState } from "react";
import '../CSS/Utils.css';


const Tooltip = ({ text }) => {
    const [showTooltip, setShowTooltip] = useState(null);
    const toggleTooltip = () => {
        setShowTooltip(!showTooltip);
    };

    return (
        <div className="tooltip-container">
            <span className="tooltip" onClick={toggleTooltip} onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
                ?
            </span>
            <div className={showTooltip===null ? "tooltip-popup initial" : showTooltip ? "tooltip-popup" : "tooltip-popup hidden"}>
                <div className="tooltip-arrow" />
                <div className="tooltip-content">{text}</div>
            </div>
        </div>
    );
};

export default Tooltip;
