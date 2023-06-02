//
import React, { useState, useRef } from 'react';

function Loader(props) {
    // Message content:
    return (
        <div className="singleMessage" id={props.index}>
            <div className="messageBanner">
                <p className="iconDesc">{rawMessage.sender} at {timeString} {rawMessage.edits > 0 ? " (edited)" : ""}</p>
                <img className="icons iconCopy" src="./images/icons/iconCopy.png" alt="Copy" onClick={() => { copyToClipboard(rawMessage.content, copySuccess); }} />
                <img className="icons iconEdit" src="./images/icons/iconEdit.png" alt="Edit" onClick={() => { openEdit(); }} />
                <img className="icons iconTrash" src="./images/icons/iconTrash.png" alt="Delete" onClick={() => { functions.delete(props.index); }} />
            </div>
            <div className="messageContent">
                {lines.map((line, j) => (
                    <div key={j}>{line}</div>
                ))}
            </div>
        </div>
    );
}

export default Loader;