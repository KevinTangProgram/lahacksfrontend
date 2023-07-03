import React, { useState, useEffect } from 'react';
import '../../CSS/Login.css';

function SetupAccountUI(props) {
    return (
        <div>
            {/* Loading:  */}
            {!props.error && 
             <div>
                <h1 className="alignCenter">Preparing your account ...</h1>
                <div className="loader"></div>
                <button onClick={() => {props.setLoginState(1)}}>Cancel</button>
            </div>
            }
            {/* Incorrect Combination:  */}
            {props.error &&
            <div>
                <h1 className="alignCenter">Error</h1>
                {props.error}
                    {props.error === "Incorrect email or password combination." && 
                        <button className="loginSmallButton" onClick={() => {
                        props.setLoginState(4);}}>Forgot your password?</button>}
                <button className="loginLargeButton" onClick={() => {
                props.setLoginState(1) }}>Back</button>
            </div>}
        </div>
    );
}
export default SetupAccountUI;