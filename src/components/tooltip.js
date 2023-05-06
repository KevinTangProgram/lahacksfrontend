import React, { useState } from "react";

const Tooltip = ({ text }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    const toggleTooltip = () => {
        setShowTooltip(!showTooltip);
    };

    return (
        <div className="tooltip-container">
            <span className="tooltip" onClick={toggleTooltip} onMouseEnter={toggleTooltip} onMouseLeave={() => setShowTooltip(false)}>
                (?)
            </span>
            {showTooltip && <div className="tooltip-text">{text}</div>}
        </div>
    );
};

export default Tooltip;
