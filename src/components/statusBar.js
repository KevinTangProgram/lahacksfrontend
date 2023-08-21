//
import { StorageManager } from '../utilities/storageManager';
import Observer from '../components/observer';
import Clock from '../components/clock';
import '../CSS/Utils.css';

function StatusBar(props) {
    // Display bar for oasis:
    return (
        <div className="statusBar">
            {/* Date: */}
            <Clock type={"date"} className={"alignLeft"} />
            {/* Synced icon or loading icon: */}
            <Observer dependencies={"StorageState"} Component={() => {
                return (
                    <div className="icon-container">
                        {StorageManager.unsyncCounter === 0 ? (
                            <img className="iconSynced" src="/images/icons/iconConfirm.png" alt="Synced" />
                        ) : (
                            <div className="iconLoading" alt="Loading"></div>
                        )}
                    </div>
                );
            }} />
            {/* Header: */}
            <h3 className="alignCenter">{props.header}</h3>
            {/* Time: */}
            <Clock type={"time"} className={"alignRight"} />
        </div>
        
    );
}

export default StatusBar;