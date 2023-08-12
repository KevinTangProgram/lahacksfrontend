import '../CSS/Test.css';
//
import React, { useState, useMemo, useContext, useEffect } from 'react';
import Clock from '../components/clock';
import Tab_oasis_ideas from './Tab_oasis_ideas';
import Tab_oasis_notes from './Tab_oasis_notes';
import { Context } from '../utilities/context';
import Observer from '../components/observer';
import { StorageManager } from '../utilities/storageManager';

function Tab_oasis() {
    // Tab Navigation:
    const [bottomTab, setBottomTab] = useState(["tabActive", "tabInactive"]);
    const [openUIByDefault, setOpenUIByDefault] = useState(false);
    const [title, setTitle] = useState(false);
    const openNotesTabWithoutUI = () => {
        setOpenUIByDefault(false);
        setBottomTab(["tabInactive", "tabActive"]);
    };
    const openNotesTabWithUI = () => {
        setOpenUIByDefault(true);
        setBottomTab(["tabInactive", "tabActive"]);
    };
    // Title input:
    const oasisInstance = useContext(Context).oasisInstance;
    const [titleValue, setTitleValue] = useState("loading...");
    const handleTitleChange = (event) => {
        setTitleValue(event.target.value);
        if (oasisInstance) {
            oasisInstance.getData(false).info.title = event.target.value;
        }
    }
    useEffect(() => {
        if (oasisInstance) {
            setTitleValue(oasisInstance.data.info.title);
        }
    }, [oasisInstance]);

    const memoizedTitleValue = useMemo(() => titleValue, [openNotesTabWithoutUI, openNotesTabWithUI]);

    return (
        <div className="backGround">
            <div className="tablet">
                {/* start banner */}
                <div className="dateAndTime">
                    <Clock type={"date"} className={"alignLeft"} />
                    <Observer dependencies={"StorageState"} Component={() => {
                        if (StorageManager.unsyncCounter === 0) {
                            // Synced:
                            return <img className="iconSync" src="/images/icons/iconConfirm.png" alt="Synced" />
                        }
                        // Syncing:
                        return <div className="loader iconSync"></div>
                    }} />
                {
                    title && <input value={titleValue} className="alignCenter" onChange={handleTitleChange} onMouseLeave={() => setTitle(false)}></input>
                }
                {
                    !title && <h3 className="alignCenter" onMouseOver={() => setTitle(true)}>{titleValue}</h3>
                }
                    <Clock type={"time"} className={"alignRight"} />
                </div>
                {/* end banner */}
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