import '../CSS/Tab_oasis.css';
//
import React, { useState, useRef } from 'react';
import copyToClipboard from '../utilities/utilities';

function SingleMessage(props) {
    // Message content:
    const rawMessage = props.rawMessage;
    const timeString = new Date(rawMessage.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    const functions = props.functions;
    const lines = rawMessage.content.split('\n');
    // Handle copying:
    function copySuccess() {
        if (isEditing) {
            textareaRef.current.focus();
            textareaRef.current.selectionStart = textareaRef.current.value.length;
            return;
        }
        functions.refocus();
    }
    // Handle editing:
    const textareaRef = useRef(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedMessage, setEditedMessage] = useState(rawMessage.content);
    function openEdit() {
        setEditedMessage(rawMessage.content);
        setIsEditing(true);
        setTimeout(() => {
            textareaRef.current.focus();;
            textareaRef.current.selectionStart = textareaRef.current.value.length;
        }, 0);
    }
    function closeEdit(save) {
        if (save === true && editedMessage !== rawMessage.content) {
            functions.edit(props.index, editedMessage);
        }
        setIsEditing(false);
        functions.refocus();
    }
    // Editing display:
    if (isEditing) {
        return (
            <div className="singleMessage" id={props.index}>
                <div className="messageBanner">
                    <p className="iconDesc">{rawMessage.sender} at {timeString} (...)</p>
                    <img className="icons iconCopy" src="/images/icons/iconCopy.png" alt="Copy" onClick={() => { copyToClipboard(editedMessage, copySuccess); }} />
                    <img className="icons iconEdit" src="/images/icons/iconConfirm.png" alt="Edit" onClick={() => { closeEdit(true); }} />
                    <img className="icons iconTrash" src="/images/icons/iconCancel.png" alt="Delete" onClick={() => { closeEdit(false); }} />
                </div>
                <div className="messageContent">
                    <textarea ref={textareaRef} className="editableMessage" value={editedMessage} 
                    onChange={(event) => { setEditedMessage(event.target.value); }}
                    onKeyDown={(event) => {
                        if (event.key === "Enter" && event.shiftKey) {
                            event.preventDefault();
                            setEditedMessage(editedMessage + "\n")
                        }
                        else if (event.key === "Enter") {
                            event.preventDefault();
                            closeEdit(true);
                        }
                        else if (event.key === "Escape") {
                            event.preventDefault();
                            closeEdit(false);
                        }
                    }}
                    ></textarea>
                </div>
            </div>
        );
    }

    // Normal display:
    return (
        <div className="singleMessage" id={props.index}>
            <div className="messageBanner">
                <p className="iconDesc">{rawMessage.sender} at {timeString} {rawMessage.edits > 0 ? " (edited)": ""}</p>
                <img className="icons iconCopy" src="/images/icons/iconCopy.png" alt="Copy" onClick={() => { copyToClipboard(rawMessage.content, copySuccess); }} />
                <img className="icons iconEdit" src="/images/icons/iconEdit.png" alt="Edit" onClick={() => { openEdit(); }} />
                <img className="icons iconTrash" src="/images/icons/iconTrash.png" alt="Delete" onClick={() => { functions.delete(props.index); }} />
            </div>
            <div className="messageContent">
                {lines.map((line, j) => (
                    <div key={j} style={{"color": "whitesmoke"}}>{line}</div>
                ))}
            </div>
        </div>
    );
}

export default SingleMessage;