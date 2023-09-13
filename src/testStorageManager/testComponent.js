import { SyncedObjectManager } from "./testStorageManager";
import { useState, useEffect } from "react";
import useSyncedObject from "./testHook";

function TestComponent() {
    function TestSynced() {
        const options = {
            defaultValue: { string: "no data", string2: "no data2" },
            debounceTime: 1000,
            reloadBehavior: "prevent",
            customSyncFunctions: {
                pull: async (syncedObject) => {
                    // console.log("pulling with key " + syncedObject.key); 
                    await new Promise(r => setTimeout(r, 2000));
                    return { string: "initial pull", string2: "initial pull2"}}, 
                push: async (syncedObject) => {
                    // console.log("pushing with key '" + syncedObject.key + "', changelog and data: ");
                    // console.log(syncedObject.changelog);
                    console.log(syncedObject.data);
                    return true;
                }
            },
            callbackFunctions: {
                onSuccess: (syncedObject, status) => {console.log("onSuccess: " + status.requestType);},
                onError: (syncedObject, status) => {console.log("onError: " + status.error);}
            },
            safeMode: true,
        };
        SyncedObjectManager.initializeSyncedObject("testKey", "custom", options);

        useEffect(() => {
            console.log("rerendering");
        });

        const { syncedObject, modify } = useSyncedObject("testKey", { dependencies: "2", safeMode: false });

        const [open, setOpen] = useState(true);

        return (
            <div style={{ "background": "lightGray", "height": "100vh" }} >
                {/* <button onClick={() => {
                    console.log(SyncedObjectManager.getSyncedObject("testKey").data);
                }}>console.log data</button> */}
                <button onClick={() => {
                    modify("string").string = "new data";
                }}>modify data</button>
                {/* <button onClick={() => {
                    setSyncedObject(SyncedObjectManager.getSyncedObject("testKey"));
                }}>refresh useState</button> */}
                <button onClick={() => { setOpen(!open) }}>open/close</button>
                <br></br>
                {open && <p>open</p>}
                {open && <p>{syncedObject?.data.string}</p>}
                {open && <p>{syncedObject?.data.string2}</p>}
            </div>);
    }

    return (
        <div>
            <TestSynced />
            <button onClick={() => {SyncedObjectManager.getSyncedObject("testKey").modify("string2").string2 = "lol"}}>lol</button>
        </div>
    );
}

export default TestComponent;