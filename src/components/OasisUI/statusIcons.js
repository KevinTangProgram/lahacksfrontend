import Loader from '../loader';
import Tooltip from '../tooltip';
import { useSyncedObject } from 'react-synced-object';


function StatusIcons({ objectKey, syncProps }) {
    // Custom dependency icons:
    if (objectKey) {
        const { modify, syncedSuccess, syncedError } = useSyncedObject(objectKey);
        return (
            <div className="twoIcon-container">
                <div className="icon-container">
                    {syncedSuccess === null && <Loader type="icon" />}
                    {syncedSuccess && <img className="iconSynced" src="/images/icons/iconConfirm.png" alt="Synced" />}
                    {syncedSuccess === false && <img className="iconSynced" src="/images/icons/iconCancel.png" alt="Synced with error" />}
                </div>
                <div className="icon-container">
                    {(syncedError && syncedSuccess !== null) &&
                        <div onClick={() => { modify() }}>
                            <Tooltip text={syncedError + "\n\n [Click to retry]"} iconComponent={() => { return <img className="iconError" src="/images/icons/iconExclamation.png" alt="Error" /> }} />
                        </div>}
                </div>
            </div>
        );
    }
    if (syncProps) {
        const { loading, success, error, retryFunc } = syncProps;
        return (
            <div className="twoIcon-container">
                <div className="icon-container">
                    {loading && <Loader type="icon" />}
                    {success && <img className="iconSynced" src="/images/icons/iconConfirm.png" alt="Synced" />}
                    {error && <img className="iconSynced" src="/images/icons/iconCancel.png" alt="Synced with error" />}
                </div>
                <div className="icon-container">
                    {error &&
                        <div onClick={() => { retryFunc() }}>
                            <Tooltip text={error + "\n\n [Click to retry]"} iconComponent={() => { return <img className="iconError" src="/images/icons/iconExclamation.png" alt="Error" /> }} />
                        </div>}
                </div>
            </div>
        );
    }
    return (
        <div className="twoIcon-container"></div>
    );
}

export default StatusIcons;