import { useState, useEffect, useMemo } from 'react';
import { SyncedObjectManager, SyncedObjectError } from './testStorageManager';

const useSyncedObject = (key, options) => {
    // Setup:
    if (!key) {
        throw new SyncedObjectError("useSyncedObject hook error: key is required", key, "useSyncedObject");
    }
    const handleProps = (options) => {
        const result = {};
        // Validate props:
        if (!options) {
            return result;
        }
        if (options.dependencies) {
            if (typeof options.dependencies === "string") {
                result.dependencies = [options.dependencies];
            }
            if (Array.isArray(options.dependencies)) {
                result.dependencies = [];
            }
            else {
                throw new SyncedObjectError("useSyncedObject hook error: options.dependencies must be an string or array of strings", key, "useSyncedObject");
            }
            // Loop through array, check each string:
            options.dependencies.forEach((dependency) => {
                if (dependency === "selfModify" || dependency === "otherModify" || dependency === "success" || dependency === "error") {
                    result.dependencies.push(dependency);
                }
                else {
                    throw new SyncedObjectError("useSyncedObject hook error: options.dependencies strings must be one of: 'selfModify', 'otherModify', 'success', 'error'", key, "useSyncedObject");
                }
            });
        }
        if (options.properties) {
            if (typeof options.dependencies === "string") {
                result.properties = [options.properties];
            }
            if (Array.isArray(options.properties)) {
                result.properties = [];
            }
            else {
                throw new SyncedObjectError("useSyncedObject hook error: options.properties must be an string or array of strings", key, "useSyncedObject");
            }
            // Loop through array, check each string:
            options.properties.forEach((properties) => {
                if (typeof properties === "string") {
                    result.properties.push(properties);
                }
                else {
                    throw new SyncedObjectError("useSyncedObject hook error: options.properties must be an string or array of strings", key, "useSyncedObject");
                }
            });
        }
        return result;
    };
    const { dependencies = ["modify", "success", "error"], properties = [] }
     = useMemo(() => {handleProps(options)}, [key]);

    useEffect(() => {
        // Initialize synced object:
        const syncedObject = SyncedObjectManager.getSyncedObject(key);
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
    const modify = (property, debounceTime) => {
        setSyncedSuccess(null);
        return syncedObject.modify(property, debounceTime);
    };

    // Utils:
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
    };
};

export default useSyncedObject;