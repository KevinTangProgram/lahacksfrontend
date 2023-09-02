import '../CSS/Test.css';

//
import React, { useState } from 'react';
import Tab_oasis_ideas from './Tab_oasis_ideas';
import Tab_oasis_notes from './Tab_oasis_notes';
import StatusBar from '../components/OasisUI/statusBar';


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

    // Output:
    return (
        <div className="backGround">
            <div className="tablet">
                <StatusBar />
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