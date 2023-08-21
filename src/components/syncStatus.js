//
import { StorageManager } from '../utilities/storageManager';
import Observer from '../components/observer';
import '../CSS/Utils.css';

function SyncStatus() {
    // Display the current status of StorageManager.state:
    return (
        <Observer dependencies={"StorageState"} Component={() => {
            return (
               <div className="icon-container">
                    {StorageManager.unsyncCounter === 0 ? (
                        <img className="iconSynced" src="/images/icons/iconConfirm.png" alt="Synced" />
                    ) : (
                        <div className="loader" alt="Loading"></div>
                    )}
                </div> 
            );
        }} />
    );
}

export default SyncStatus;