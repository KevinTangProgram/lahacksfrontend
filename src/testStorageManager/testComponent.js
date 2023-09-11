import { SyncedObjectManager } from "./testStorageManager";
import { useState, useEffect } from "react";
import useSyncedObject from "./testHook";

function TestComponent() {

    try {
        const options = {
            defaultValue: {string: "no data"},
            debounceTime: 1000,
            reloadBehavior: "finish",
            customSyncFunctions: { 
                pull: async (syncedObject) => {
                    console.log("pulling with key " + syncedObject.key); 
                    await new Promise(r => setTimeout(r, 2000));
                    return { string: "initial pull"}}, 
                push: async (syncedObject) => {
                    console.log("pushing with key '" + syncedObject.key + "', changelog and data: ");
                    // console.log(syncedObject.changelog);
                    // console.log(syncedObject.data);
                    return true;
                }},
            callbackFunctions: { 
                onSuccess: (syncedObject, status) => {console.log("onSuccess: " + status.requestType);},
                onError: (syncedObject, status) => {console.log("onError: " + status.error);}
            },
            disableChecks: false,
        };
        SyncedObjectManager.initializeSyncedObject("testKey", "custom", options);

        useEffect(() => {
            console.log("rerendering");
        }, []);

        const { syncedObject } = useSyncedObject("testKey");

        const [open, setOpen] = useState(true);

        return (
            <div style={{ "background": "lightGray", "height": "100vh" }} >
                {/* <button onClick={() => {
                    console.log(SyncedObjectManager.getSyncedObject("testKey").data);
                }}>console.log data</button>
                <button onClick={() => {
                    syncedObject.modify("string").string = "new data";
                }}>modify data</button>
                <button onClick={() => {
                    setSyncedObject(SyncedObjectManager.getSyncedObject("testKey"));
                }}>refresh useState</button> */}
                <button onClick={() => {setOpen(!open)} }>open/close</button>
                <br></br>
                <button>hello</button>

                {open && <p>open</p>}
                {/* {open && <p>{syncedObject?.data.string}</p>} */}

            </div>);
    }
    catch (error) {
        console.log(error);
        // alert(error);
        throw (error);
    }
}

export default TestComponent;