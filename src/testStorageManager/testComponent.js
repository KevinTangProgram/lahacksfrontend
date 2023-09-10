import { StorageManager } from "./testStorageManager";
import { useState, useEffect } from "react";

function TestComponent() {

    try {
        const options = {
            defaultValue: {string: "hey"},
            debounceTime: 1000,
            reloadBehavior: "finish",
            customSyncFunctions: { pull: () => {console.log("pulled"); return { string: "just pulled!"}}, push: () => {console.log("pushed")}},
            callbackFunctions: { onSuccess: (requestType) => {console.log("synced, " + requestType)}}
        };
        StorageManager.initializeSyncedObject("testKey", "custom", options);
        // console.log(StorageManager.getSyncedObject("testKey"));

        useEffect(() => {
            console.log("rerendering");
            setSyncedObject(StorageManager.getSyncedObject("testKey"));
        }, []);

        const [syncedObject, setSyncedObject] = useState(null);
        const [open, setOpen] = useState(true);

        return (
            <div style={{ "background": "lightGray", "height": "100vh" }} >
                <button onClick={() => {
                    console.log(StorageManager.getSyncedObject("testKey").data);
                }}>console.log data</button>
                <button onClick={() => {
                    syncedObject.data.string = "new data";
                    StorageManager.getSyncedObject("testKey").modify();
                }}>modify data</button>
                <button onClick={() => {
                    setSyncedObject(StorageManager.getSyncedObject("testKey"));
                }}>refresh useState</button>
                <button onClick={() => {setOpen(!open)} }>open/close</button>

                {open && <p>open</p>}
                {open && <p>{syncedObject?.data.string}</p>}

            </div>);
    }
    catch (error) {
        console.log(error);
        // alert(error);
        throw (error);
    }
}

export default TestComponent;