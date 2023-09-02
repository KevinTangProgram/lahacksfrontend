import React, { useState, useEffect } from 'react';
import { StorageManager } from '../utilities/storageManager.js';
//

export default function Observer({ dependencies, Component }) {
    // Workflow:
    // 1. Subscribe to StorageManager events (syncedObjectChange)
    // 2. Rerender when event is received.
    // 3. Display component (Component).
    // Rules:
    // - dependencies: array of strings, each string is a key in StorageManager.syncedObjects. 
    // - Accepts the '.' operator to create dependencies on a specific property of a syncedObject.

    // Utils:
    function getNestedValue(dependency) {
        // Takes in a dependency string, returns the value of the nested property.
        const keyArray = dependency.split('.');
        const object = StorageManager.read(keyArray[0]);
        let value = object;
        for (let i = 1; i < keyArray.length; i++) {
            // Recursively get the value of the nested property:
            const key = keyArray[i];
            value = value[key];
            if (value === undefined) {
                console.log("Error: Observer dependency not found: " + dependency);
                return null;
            }
        }
        if (typeof value === "object") {
            // Store value of objects:
            if ((Array.isArray(value) && value.length > 10) || (Object.keys(value).length > 10)) {
                // Too large, don't bother:
                return null;
            }
            return JSON.stringify(value);
        }
        else {
            // Store value of primitives:
            return value;
        }
    }
    // Setup dependencies:
    dependencies = Array.isArray(dependencies) ? dependencies : [dependencies];
    const subDependencyValues = [];
    dependencies.map((dependency) => {
        if (dependency.includes('.')) {
            // Store subdependency value:
            subDependencyValues.push(getNestedValue(dependency));
        }
        else {
            // Store null for main syncedObject:
            subDependencyValues.push(null);
        }
    });
    // Rerendering:
    const [renderCount, setRenderCount] = useState(0);
    useEffect(() => {
        // Event listener:
        const handleChange = (event) => {
            // Check the event hits any dependencies:
            const indexes = dependencies.reduce((array, string, index) => {
                // Store indexes:
                if (string === event.detail.syncedObject || string.startsWith(event.detail.syncedObject + ".")) {
                    array.push(index);
                }
                return array;
            }, []);
            // No dependencies hit:
            if (indexes.length === 0) {
                return;
            }
            // Check change for each dependency:
            indexes.forEach((index) => {
                if (subDependencyValues[index] === null) {
                    // Main syncedObject, rerender:
                    setRenderCount(renderCount => renderCount + 1);
                    console.log("rerendering because of " + dependencies[index]);
                    return;
                }
                // Subdependency of syncedObject, check for changes:
                const newValue = getNestedValue(dependencies[index]);
                if (newValue !== subDependencyValues[index]) {
                    subDependencyValues[index] = newValue;
                    setRenderCount((renderCount) => renderCount + 1);
                }
            });
        };

        // Event setup:
        document.addEventListener('syncedObjectChange', handleChange);
        return () => {
            document.removeEventListener('syncedObjectChange', handleChange);
        };
    }, []);
    return <Component key={renderCount}/>;
};
