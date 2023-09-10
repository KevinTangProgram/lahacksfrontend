import { useState, useEffect, useMemo } from 'react';
import { StorageManager } from './testStorageManager';

const useSyncedObject = (key, rerenderOptions) => {
    // Setup:
    if (!key) {
        throw new Error("useSyncedObject hook error: key is required");
    }
    const { dependencies = ["modify", "success", "error"], properties = [] }
     = useMemo(() => {handleProps(rerenderOptions)}, [key]);

    useEffect(() => {
        // Initialize synced object:
        const syncedObject = StorageManager.getSyncedObject(key);
        if (!syncedObject) {
            return;
        }
        setSyncedObject(syncedObject);
        setSyncedData(syncedObject.data);

        // Add event listener: 
        document.addEventListener('syncedObjectEvent', eventHandler);

        // Cleanup:
        return () => {
            document.removeEventListener('syncedObjectEvent', eventHandler);
        };
    }, [rerender]);

    // Vars:
    const [syncedObject, setSyncedObject] = useState(null);
    const [syncedData, setSyncedData] = useState(null);
    const [syncedSuccess, setSyncedSuccess] = useState(null);
    const [syncedError, setSyncedError] = useState(null);
    const [rerender, setRerender] = useState(0);
 
    // Interface:
    const modify = (debounceTime) => {
        setSyncedSuccess(null);
        return syncedObject.modify(debounceTime);
    };
    const modifyProperty = (property, debounceTime) => {
        setSyncedSuccess(null);
        return syncedObject.modifyProperty(property, debounceTime);
    };

    // Utils:
    const handleProps = (rerenderOptions) => {
        const result = {};
        // Validate props:
        if (!rerenderOptions) {
            return result;
        }
        if (rerenderOptions.dependencies) {
            if (typeof rerenderOptions.dependencies === "string") {
                result.dependencies = [rerenderOptions.dependencies];
            }
            if (Array.isArray(rerenderOptions.dependencies)) {
                result.dependencies = [];
            }
            else {
                throw new Error("useSyncedObject hook error: rerenderOptions.dependencies must be an string or array of strings");
            }
            // Loop through array, check each string:
            rerenderOptions.dependencies.forEach((dependency) => {
                if (dependency === "selfModify" || dependency === "otherModify" || dependency === "success" || dependency === "error") {
                    result.dependencies.push(dependency);
                }
                else {
                    throw new Error("useSyncedObject hook error: rerenderOptions.dependencies strings must be one of: 'selfModify', 'otherModify', 'success', 'error'");
                }
            });
        }
        if (rerenderOptions.properties) {
            if (typeof rerenderOptions.dependencies === "string") {
                result.properties = [rerenderOptions.properties];
            }
            if (Array.isArray(rerenderOptions.properties)) {
                result.properties = [];
            }
            else {
                throw new Error("useSyncedObject hook error: rerenderOptions.properties must be an string or array of strings");
            }
            // Loop through array, check each string:
            rerenderOptions.properties.forEach((properties) => {
                if (typeof properties === "string") {
                    result.properties.push(properties);
                }
                else {
                    throw new Error("useSyncedObject hook error: rerenderOptions.properties must be an string or array of strings");
                }
            });
        }
        return result;
    };
    const eventHandler = (event) => {
        // Key check:
        if (event.detail.syncedObject.key !== key) {
            return;
        }
        // Property check:
        if (properties.length > 0 && event.detail.changelog.length > 0) {
            const containsCommonElement = event.detail.changelog.some(element => properties.includes(element));
            if (!containsCommonElement) {
                return;
            }
        }
        // Dependency checks:
        if (dependencies.includes("modify")) {
            setRerender(rerender => rerender + 1);
        }
        if (dependencies.includes("success")) {
            setSyncedSuccess(event.detail.success);
            setRerender(rerender => rerender + 1);
        }
        if (dependencies.includes("error")) {
            setSyncedError(event.detail.error);
            setRerender(rerender => rerender + 1);
        }
    }

    // Exports:
    return {
        syncedObject,
        syncedData,
        syncedSuccess,
        syncedError,
        modify,
        modifyProperty
    };
};

export default useSyncedObject;