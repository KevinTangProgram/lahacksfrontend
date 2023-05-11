import '../CSS/Test.css';
//
import React, { useState } from 'react';
import Clock from '../components/clock';
import Tab_oasis_ideas from './Tab_oasis_ideas';
import Tab_oasis_notes from './Tab_oasis_notes';

function Tab_oasis() {
    const [bottomTab, setBottomTab] = useState(["tabActive", "tabInactive"]);

    return (
        <div className="backGround">
                <div className="tablet">
                    <div className="dateAndTime">
                        <Clock type={"date"} className={"alignLeft"} />
                        <Clock type={"time"} className={"alignRight"} />
                    </div>
                    <h1>Title</h1>
                    <div className="twoButtons">
                        <button className="selectCells" id={bottomTab[0]} onClick={() => { setBottomTab(["tabActive", "tabInactive"]) }}>Ideas</button>
                        <button className="selectCells" id={bottomTab[1]} onClick={() => { setBottomTab(["tabInactive", "tabActive"]) }}>Generated Notes</button>
                    </div>
                </div>
            <div className="activeTab">
                {bottomTab[0] === "tabActive" && <Tab_oasis_ideas />}
                {bottomTab[1] === "tabActive" && <Tab_oasis_notes />}
            </div>
        </div>
    );
}

export default Tab_oasis;