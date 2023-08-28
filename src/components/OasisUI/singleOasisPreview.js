//
import { useState, useEffect, useRef } from "react";
import { NavLink } from 'react-router-dom';
import { getHumanizedDate } from '../../utilities/utilities';
import Tooltip from '../tooltip';


function SingleOasisPreview(props) {
    // Props:
    const oasis = props.oasis;
    const focusOasis = props.focusOasis;
    const setOpenMenuId = props.setOpenMenuId;
    const showMenu = props.showMenu;
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
        <div className="oasisPreview" activeClassName="oasisPreview active" onContextMenu={(event) => {
            event.preventDefault(); 
            setOpenMenuId(oasis._id);
            }}>
            <NavLink to={"/oasis/" + oasis._id} className="oasisLink" key={oasis._id} onClick={() => {
                focusOasis();
            }}>
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
                <div style={{ "display": "flex", "margin-left": "45%" }}>
                    <Tooltip text={oasis.info.description} />
                    <button className="alignRight" onClick={(event) => {
                        stopClick(event);
                        if (showMenu) {
                            setOpenMenuId(null);
                        }
                        else {
                            setOpenMenuId(oasis._id);
                        }
                    }}>=</button>
                </div>
                {/* Menu: */}
                {showMenu && <div>
                    <div className="context-menu" onClick={(event) => { stopClick(event) }}>
                        <div className="context-menu-option"> <a ref={oasisPreviewRef} className="oasisLink" href={oasis._id} target="_blank">
                            Open in New Tab</a></div>
                        <div className="context-menu-option" onClick={() => {
                            
                        }}>Rename</div>
                        <div className="context-menu-option" onClick={() => {
                            
                        }}>Delete</div>
                    </div>
                    </div>}
            </NavLink>
        </div>
    );
}

export default SingleOasisPreview;