//
import React, { useState, useRef } from 'react';
import '../CSS/Utils.css';

const Loader = React.memo((props) => {
    if (!props.type || props.type === "icon")
    return (
        // Singular Loading Icon:
        <div className="iconLoading"></div>
    );
    if (props.type === "fill")
    return (
        // Overlay the entire screen:
        <div class="loading-fill-overlay">
            <div class="loading-fill-animation"></div>
        </div>
    );
    if (props.type === "content")
    return (
        // Fill content to parent element size:
        <div>
            
        </div>
        );
});

export default Loader;