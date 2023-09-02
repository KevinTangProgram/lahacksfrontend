import React, { useState } from "react";
import '../CSS/Utils.css';


const Tooltip = ({ text, iconComponent }) => {
    const [showTooltip, setShowTooltip] = useState(null);
    const toggleTooltip = () => {
        setShowTooltip(!showTooltip);
    };
    

    return (
        <div className="tooltip-container">
            {iconComponent && <div onClick={toggleTooltip} onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>{iconComponent()}</div>}
            {!iconComponent &&
            <span className="tooltip" onClick={toggleTooltip} onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
                ?
            </span>}
            <div className={showTooltip===null ? "tooltip-popup initial" : showTooltip ? "tooltip-popup" : "tooltip-popup hidden"}>
                <div className="tooltip-arrow" />
                <div className="tooltip-content">{text}</div>
            </div>
        </div>
    );
};

export default Tooltip;
