//
import { useState, useEffect, useRef } from "react";
import { NavLink } from 'react-router-dom';
import { getHumanizedDate } from "../clock";
import Tooltip from '../tooltip';


function SingleOasisPreview(props) {
    // Props:
    const { oasis, focusOasis, openOasisUI, contextMenuInfo } = props;
    const { setMenu, showMenu, coords } = contextMenuInfo;
    // Context Menu:
    const oasisPreviewRef = useRef(null);
    const stopClick = (event) => {
        event.preventDefault(); // stop navlink from firing
        event.stopPropagation(); // stop onClick from firing
        if (event.target === oasisPreviewRef.current) {
            // Workaround for 'open in new tab'
            const newTab = window.open("/oasis/" + oasis._id, '_blank');
            if (newTab) {
                newTab.focus();
            }
        }
    }   

    return (
        <NavLink to={"/oasis/" + oasis._id} className="oasisPreview" activeclassname="oasisPreview active" key={oasis._id} onClick={() => {
                focusOasis(oasis._id);
            }} onContextMenu={(event) => {
                event.preventDefault(); 
                setMenu(oasis._id, event.clientX, event.clientY);
                }
            }>
                {/* Content: */}
                <div className="content">
                    <div className="title">{oasis.info.title}</div>
                    <div className="desc">
                        - {oasis.settings.sharing} oasis
                        <br></br>
                        - {oasis.stats.size.ideaCount} ideas
                        <br></br>
                        - edited {getHumanizedDate(oasis.stats.state.lastEditDate)}
                    </div>
                </div>
                {/* Buttons: */}
                <div style={{ "display": "flex", "marginLeft": "45%" }}>
                    <Tooltip text={oasis.info.description} />
                    <button className="openContextButton alignRight" onClick={(event) => {
                        stopClick(event);
                        if (showMenu) {
                            setMenu(null);
                        }
                        else {
                            setMenu(oasis._id, event.clientX, event.clientY);
                        }
                    }}>=</button>
                </div>
                {/* Menu: */}
                {showMenu && <div>
                <div className="context-menu" style={{ position: 'fixed', bottom: `${window.innerHeight - coords.y}px`, left: `${coords.x}px` }} onClick={(event) => { stopClick(event) }}>
                        <div className="context-menu-option" ref={oasisPreviewRef} onClick={() => { setMenu(null); }}>
                            Open in New Tab</div>
                    <div className="context-menu-option" onClick={() => { setMenu(null); openOasisUI(oasis, "edit");}}>
                            Rename</div>
                    <div className="context-menu-option" onClick={() => { setMenu(null); openOasisUI(oasis, "delete");}}>
                            Delete</div>
                    </div>
                </div>}
            </NavLink>
    );
}

export default SingleOasisPreview;