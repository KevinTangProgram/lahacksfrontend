import React, { useState, useEffect } from 'react';
import '../../CSS/Login.css';

function SetupAccountUI(props) {
    return (
        <div className="overlay" style={{
            left: '30%', top: '30%', width: '40%', height: '60%',
            backgroundColor: '#f3ffff', borderRadius: '1em', boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.2)'
        }}>
            {!props.error && 
             <div>
                <h1 style={{ "textAlign": "center" }}>Preparing your account ...</h1>
                <div className="loader"></div>
                <button onClick={() => {props.setLoginState(1)}}>Cancel</button>
            </div>
            }
           {props.error &&
           <div>
                <h1 style={{ "textAlign": "center" }}>Error</h1>
                {props.error}
                    {props.error === "Incorrect email or password combination." && 
                    <div style={{ "fontSize": "12px", "marginTop": "20px", "marginBottom": "20px" }}>
                        <button style={{ "textDecoration": "none", "border": "none", "backgroundColor": "transparent", "cursor": "pointer", "color": "#10a37f" }} onClick={() => {
                            props.setLoginState(4);
                        }}>Forgot your password?</button>
                    </div>}
                <button className="selectCells" id="submitAndConfirmLong" style={{ "borderRadius": "1em", "height": "2em", "width": "80%" }} onClick={() => {
                props.setLoginState(1) }}>Back</button>
           </div>
           }

        </div>
    );
}
export default SetupAccountUI;