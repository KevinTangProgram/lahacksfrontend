//
import { StorageManager } from '../../utilities/storageManager';
import Observer from '../observer';
import Clock from '../clock';
import Loader from '../loader';
import Tooltip from '../tooltip';
import '../../CSS/Utils.css';
import { useState, useRef, useContext } from 'react';
import { useParams } from "react-router-dom";
import { Context } from '../../utilities/context';

function StatusBar() {
    function StatusBarIcons() {
        return (
            <div className="twoIcon-container">
                <div className="icon-container">
                    {StorageManager.unsyncCounter === 0 ? (
                        <img className="iconSynced" src="/images/icons/iconConfirm.png" alt="Synced" />
                    ) : (
                        <Loader type="icon" />
                    )}
                </div>
                <div className="icon-container">
                    {StorageManager.syncError ? (
                        <Tooltip text={StorageManager.syncError} iconComponent={() => { return <img className="iconError" src="/images/icons/iconExclamation.png" alt="Error" /> }} />) : null}
                </div>
            </div>
        );
    }
    function StatusBarHeader() {
        // Setup:
        const { id } = useParams();
        const oasisInstance = useContext(Context).oasisInstance;

        if (!oasisInstance || !id) {
            // No Oasis Instance:
            return (
                <div className="titleContainer alignCenter">
                    <h3 className="titleText">Settings</h3>
                </div>
                
            );
        }
        // Oasis Instance:
        const [showInput, setShowInput] = useState(false);
        const [titleValue, setTitleValue] = useState(oasisInstance.getData("info").title);
        const handleTitleChange = (event) => {
            setTitleValue(event.target.value);
            oasisInstance.setData("info").title = event.target.value;
        }
        // Input - Text transition:
        const textRef = useRef(null);
        const inputRef = useRef(null);
        const [dimensions, setDimensions] = useState({});
        const openInput = () => {
            setDimensions({
                width: textRef.current.offsetWidth,
                height: textRef.current.offsetHeight,
            });
            setShowInput(true);
            setTimeout(() => {
                inputRef.current.focus();;
                inputRef.current.selectionStart = inputRef.current.value.length;
            }, 0);
        };
        const closeInput = () => {
            setShowInput(false);
        };
        return (
            <div className="titleContainer alignCenter">
                {showInput && <textarea className="titleInput" ref={inputRef} style={dimensions} type="text" value={titleValue} onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === "Escape") {
                        event.preventDefault();
                        closeInput();
                    }
                }} onChange={handleTitleChange} onBlur={closeInput} />}
                {!showInput && <h3 className="titleText" ref={textRef} onClick={openInput}>{titleValue}</h3>}
            </div>
        );
    }

    return (
        <div className="tablet statusBar">
            <Clock type={"date"} className={"alignLeft"} />
            <Observer dependencies={"StorageState"} Component={StatusBarIcons} />
            <StatusBarHeader />
            <Clock type={"time"} className={"alignRight"} />
        </div>
    );
}

export default StatusBar;