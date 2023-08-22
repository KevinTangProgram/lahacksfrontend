import '../CSS/Test.css';
//
import React, { useState, useRef, useContext, useEffect } from 'react';
import Tab_oasis_ideas from './Tab_oasis_ideas';
import Tab_oasis_notes from './Tab_oasis_notes';
import { Context } from '../utilities/context';
import StatusBar from '../components/statusBar';

function Tab_oasis() {
    // Tab Navigation:
    const [bottomTab, setBottomTab] = useState(["tabActive", "tabInactive"]);
    const [openUIByDefault, setOpenUIByDefault] = useState(false);
    const openNotesTabWithoutUI = () => {
        setOpenUIByDefault(false);
        setBottomTab(["tabInactive", "tabActive"]);
    };
    const openNotesTabWithUI = () => {
        setOpenUIByDefault(true);
        setBottomTab(["tabInactive", "tabActive"]);
    };
    // Title Editing:
    const titleComponent = () => {
        // Title input:
        const oasisInstance = useContext(Context).oasisInstance;
        const [showInput, setShowInput] = useState(false);
        const [titleValue, setTitleValue] = useState(oasisInstance.getData().info.title);
        const handleTitleChange = (event) => {
            setTitleValue(event.target.value);
            oasisInstance.setData().info.title = event.target.value;
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
            <div className="titleContainer">
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
        <div className="backGround">
            <div className="tablet">
                <StatusBar headerComponent={titleComponent} />
                <div className="twoButtons">
                    <button className="selectCells" id={bottomTab[0]} onClick={() => { setBottomTab(["tabActive", "tabInactive"]) }}>Ideas</button>
                <button className="selectCells" id={bottomTab[1]} onClick={() => { openNotesTabWithoutUI() }}>Generated Notes</button>
                </div>
            </div>
            <div className="activeTab">
                {bottomTab[0] === "tabActive" && <Tab_oasis_ideas forceOpenUI={openNotesTabWithUI}/>}
                {bottomTab[1] === "tabActive" && <Tab_oasis_notes openUIByDefault={openUIByDefault} titleValue={memoizedTitleValue}/>}
            </div>
        </div>
    );
}

export default Tab_oasis;