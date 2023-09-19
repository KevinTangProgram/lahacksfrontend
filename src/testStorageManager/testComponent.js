import { getSyncedObject, initializeSyncedObject, useSyncedObject, findInLocalStorage, removeFromLocalStorage, deleteSyncedObject } from "react-synced-object";
import { useState, useEffect } from "react";
// import useSyncedObject from "./testHook";

function TestComponent() {
    function TestSynced() {
        const options = {
            defaultValue: { string: "no data", string2: "no data2" },
            debounceTime: 1000,
            reloadBehavior: "prevent",
            customSyncFunctions: {
                pull: async (syncedObject) => {
                    // console.log("pulling with key " + syncedObject.key); 
                    // await new Promise(r => setTimeout(r, 2000));
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
        initializeSyncedObject("testKey", "local", options);

        useEffect(() => {
            console.log("rerendering");
        });

        const { syncedObject, modify } = useSyncedObject("testKey", {properties: "string2", safeMode: true });


        return (
            <div>
                {/* <button onClick={() => {
                    console.log(SyncedObjectManager.getSyncedObject("testKey").data);
                }}>console.log data</button> */}
                <button onClick={() => {
                    modify().string = "new data";
                }}>modify data</button>
                {/* <button onClick={() => {
                    setSyncedObject(SyncedObjectManager.getSyncedObject("testKey"));
                }}>refresh useState</button> */}
                <p>{syncedObject?.data.string}</p>
                <p>{syncedObject?.data.string2}</p>
            </div>);
    }
    function TestLocalStorage() {
        // console.log(removeFromLocalStorage("allRawMessages", "ignore"));
        const [object, setObject] = useState(null);
        return (
            <div>
                <p>hello: </p>
                <button onClick={() => {
                    const testLocal = initializeSyncedObject("testLocal", "local", { defaultValue: "hello", debounceTime: 2000, safeMode: false });
                    console.log(testLocal);
                    setObject(testLocal);
                }}>create object 'testLocal'</button>
                <button onClick={() => {
                    const testLocal = getSyncedObject("testLocal");
                    console.log(testLocal);
                }}>try to console testLocal</button>
                <button onClick={() => {
                    // const testLocal = getSyncedObject("testLocal");
                    // testLocal.data = "hello2";
                    object.data = "hello2";
                    object.modify();
                }}>try to modify testLocal</button>
                <button onClick={() => {
                    const testLocal = removeFromLocalStorage("testLocal", "delete");
                    console.log(testLocal);
                }}>remove 'testLocal' from storage</button>
            </div>
        );
    }
    function TestStatusIconsAndCustomSync() {
        const options = {
            defaultValue: { string: "no data" },
            debounceTime: 1000,
            reloadBehavior: "prevent",
            customSyncFunctions: {
                pull: async (syncedObject) => {
                    await new Promise(r => setTimeout(r, 2000));
                    return { string: "initial pull" }
                },
                push: async (syncedObject) => {
                    await new Promise(r => setTimeout(r, 2000));
                    console.log(syncedObject.data);
                    return true;
                }
            },
            callbackFunctions: {
                onSuccess: (syncedObject, status) => { console.log("onSuccess: " + status.requestType); },
                onError: (syncedObject, status) => { console.log("onError: " + status.error); }
            },
            safeMode: true,
        };
        initializeSyncedObject("testCustom", "custom", options);
        const { syncedError, syncedSuccess, syncedObject, syncedData, modify } = useSyncedObject("testCustom");
        return (
            <div>
                <p>====</p>
                {syncedError && <p onClick={() => {modify()}}>ERROR</p>}
                {syncedSuccess && <p>SUCCESS</p>}
                {syncedSuccess === null && <p>LOADING</p>}
                {syncedData && <p>{syncedData.string}</p>}
                <button onClick={() => {
                    console.log(syncedObject);
                }}>try to console testCustom</button>
                <button onClick={() => {
                    syncedData.string = "hello2";
                    modify();
                }}>try to modify testCustom</button>
                <button onClick={() => {
                    deleteSyncedObject("testCustom");
                }}>delete testCustom</button>
            </div>
        );
    }
    function TestStuff() {
        initializeSyncedObject("myObject", "local", { defaultValue: { myProperty: "hello" } });
        const { syncedObject, modify } = useSyncedObject("myObject");
        return (
            <div>
                {syncedObject && syncedObject.data.myProperty}
                <input onChange={(event) => {syncedObject.modify().myProperty = event.target.value}}></input>
            </div>
        );
    }
    const [open, setOpen] = useState(true);


    return (
        <div style={{ "background": "lightGray", "height": "100vh" }}>
            <button onClick={() => { setOpen(!open) }}>open/close</button>
            <br></br>
            {open && <p>open</p>}
            {open && <div>
                {/* <TestSynced />
                <TestLocalStorage />
                <button onClick={() => { getSyncedObject("testKey").modify("string2").string2 = "lol" }}>lol</button>
                <TestStatusIconsAndCustomSync /> */}
                <TestStuff />
                </div>}

        </div>
    );
}

export default TestComponent;