import React, { useState, useEffect } from 'react';
//

export default function Observer({ dependencies, props, Component }) {
    // Workflow:
    // 1. Subscribe to StorageManager events (syncedObjectChange)
    // 2. Rerender when event is received.
    // 3. Display component (Component).
    //
    const [renderCount, setRenderCount] = useState(0);
    useEffect(() => {
        const handleChange = (event) => {
            if (dependencies.includes(event.detail.syncedObject)) {
                setRenderCount(renderCount => renderCount + 1);
            }
        };
        document.addEventListener('syncedObjectChange', handleChange);
        return () => {
            document.removeEventListener('syncedObjectChange', handleChange);
        };
    }, []);
    return <Component key={renderCount}/>;
};
