// context.js
import { createContext, useState } from 'react';



export class ContextManager {
    // Holds instance/tab-specific data for our web app.
    // A instance is created upon startup and is held as react useContext at the root.
    // Use react useContext from within any component to access the instance.
    constructor() {
        this.oasisInstance = null;
    }
}

export const Context = createContext();

export function ContextProvider({ children }) {
    // Vars:
    const [data, setData] = useState(new ContextManager());

    return (
        <Context.Provider value={data}>
            {children}
        </Context.Provider>
    );
}
