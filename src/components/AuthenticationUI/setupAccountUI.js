import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CONST } from '../../utilities/CONST.js';
import '../../CSS/Login.css';
import { UserManager } from '../../utilities/userManager.js';

function SetupAccountUI(props) {
    return (
        <div className="overlay" style={{
            left: '30%', top: '30%', width: '40%', height: '60%',
            backgroundColor: '#f3ffff', borderRadius: '1em', boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.2)'
        }}>
            <h1 style={{ "textAlign": "center" }}>Setting up your account ...</h1>
            <div className="loader"></div>
            <button onClick={() => {props.setLoginState(1)}}>Cancel</button>
        </div>
    );
}
export default SetupAccountUI;