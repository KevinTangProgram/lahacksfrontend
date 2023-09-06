import React, { useState, useEffect } from 'react';
import '../../CSS/Login.css';
import { UserManager } from '../../utilities/userManager';
import Loader from '../loader.js';
import { useNavigate } from 'react-router-dom';

function DeleteAccountUI(props) {
    // Setup:
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    function deleteAccount() {
        setError(null);
        setLoading(true);
        UserManager.deleteAccount()
            .then(() => {
                setLoading(false);
                navigate('/home');
                window.location.reload(true);
            })
            .catch((error) => {
                setLoading(false);
                setError(error);
            });
    }

    // Output:
    if (!UserManager.user._id) {
        return (
            <div>
                <h1>Delete Account</h1>
                <h2>Error:</h2>
                <p className="loginError">You must be logged in to delete your account.</p>
            </div>
        );
    }
    return (
        <div>
            <h1>Delete Account</h1>
            <div className="backGround">
                {props.UserPreview && props.UserPreview()}
            </div>
            <div className="selectGridSmall">
                {/* Header */}
                <p>Are you sure you want to delete your account? <br></br>This will also delete your active oases, and cannot be undone. </p>
                {/* Submit */}
                <button className={loading ? "loginLargeButton lowOpacity" : "loginLargeButton"} onClick={() => { if (!loading) deleteAccount() }}>Delete Forever</button>
                {/* Error Display: */}
                {error && <p className="loginTextboxError">{error}</p>}
                {/* Loading Display: */}
                {loading && <Loader type="icon" />}
                <br></br>
            </div>
        </div>
    );
}
export default DeleteAccountUI;