import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { UserManager } from '../utilities/userManager.js';

function User() {
    const { token } = useParams();
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const fetchData = async () => {
        // await UserManager.setupFromEmail(token)
        //     .then(email => {
        //         // Success, email:
        //         setData(email);
        //     })
        //     .catch(error => {
        //         setError(error);
        //     });
        try {
            const email = await UserManager.setupFromEmail(token);
            setData(email);
        }
        catch (error) {
            setError(error);
        }
    };
    useEffect(() => {
        fetchData();
    }, [token]);

    return (
        <div>
            {data ? (
                <h1>Data: {data}</h1>
            ) : (
                <h1>Loading...</h1>
            )}
            {error && (
                <p>Error: {error}</p>
            )}
        </div>
    );
}

export default User;