import React, { useState, useEffect } from 'react';
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
        for (let i = 1; i < dependency.length; i++) {
            // Recursively get the value of the nested property:
            const key = keyArray[i];
            value = value[key];
            if (value === undefined) {
                console.log("Error: Observer dependency not found: " + dependency);
                return null;
            }
        }
        return value;
    }
    // Setup dependencies:
    dependencies = Array.isArray(dependencies) ? dependencies : [dependencies];
    const subDependencyValues = [];
    dependencies.map((dependency) => {
        // subDependencies stores values of subdependencies:
        if (dependency.includes('.')) {
            subDependencyValues.push(getNestedValue(dependency));
        }
        else {
            subDependencyValues.push(null);
        }
    });
    // Rerendering:
    const [renderCount, setRenderCount] = useState(0);
    useEffect(() => {
        // Event listener:
        const handleChange = (event) => {
            // Check the event hits any dependencies:
            const index = dependencies.findIndex(str => str.includes(event.detail.syncedObject));
            if (index === -1) {
                return;
            }
            // Check if the event hits any subdependencies:
            if (subDependencyValues[index] === null) { 
                // No subdependencies, rerender:
                setRenderCount(renderCount => renderCount + 1);
                return;
            }
            else {
                // Check if the subdependency value has changed:
                const newValue = getNestedValue(dependencies[index]);
                if (newValue !== subDependencyValues[index]) {
                    // Subdependency value has changed, rerender:
                    setRenderCount(renderCount => renderCount + 1);
                }
            }
        };

        // Event setup:
        document.addEventListener('syncedObjectChange', handleChange);
        return () => {
            document.removeEventListener('syncedObjectChange', handleChange);
        };
    }, []);
    return <Component key={renderCount}/>;
};
