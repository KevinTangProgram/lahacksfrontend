import Loader from '../loader';
import Tooltip from '../tooltip';
import { StorageManager } from '../../utilities/storageManager';


function StatusIcons({ syncProps }) {
    // Custom dependency icons:
    if (syncProps) {
        console.log("sync props!");
        const { syncLoading, syncSuccess, syncError, syncRetryFunc } = syncProps;
        return (
            <div className="twoIcon-container">
                <div className="icon-container">
                    {syncLoading && <Loader type="icon" />}
                    {syncSuccess && <img className="iconSynced" src="/images/icons/iconConfirm.png" alt="Synced" />}
                    {syncError && <img className="iconSynced" src="/images/icons/iconCancel.png" alt="Synced with error" />}
                </div>
                <div className="icon-container">
                    {syncError &&
                        <div onClick={() => { syncRetryFunc() }}>
                            <Tooltip text={syncError + "\n\n [Click to retry]"} iconComponent={() => { return <img className="iconError" src="/images/icons/iconExclamation.png" alt="Error" /> }} />
                        </div>}
                </div>
            </div>
        );
    }
    // Default StorageManager icons:
    return (
        <div className="twoIcon-container">
            <div className="icon-container">
                {StorageManager.unsyncCounter === 0 ? (
                    StorageManager.syncError ? (
                        // Synced, but error:
                        <img className="iconSynced" src="/images/icons/iconCancel.png" alt="Synced with error" />
                    ) : (
                        // Synced, success:
                        <img className="iconSynced" src="/images/icons/iconConfirm.png" alt="Synced" />
                    )
                ) : (
                    // Syncing...
                    <Loader type="icon" />
                )}
            </div>
            <div className="icon-container">
                {StorageManager.syncError ? (
                    // Display error:
                    <div onClick={() => { StorageManager.retryLastErrorSync() }}>
                        <Tooltip text={StorageManager.syncError.error + "\n\n [Click to retry]"} iconComponent={() => { return <img className="iconError" src="/images/icons/iconExclamation.png" alt="Error" /> }} />
                    </div>) : null}
            </div>
        </div>
    );
}

export default StatusIcons;