import LoginAccountUI from './loginAccountUI';
import CreateAccountUI from './createAccountUI';
import SetupAccountUI from './setupAccountUI';
import ForgotPasswordUI from './forgotPasswordUI';
import '../../CSS/Login.css';
import { useState, useEffect } from 'react';
import DeleteAccountUI from './deleteAccountUI';


function Authenticator(props) {
    const [loginState, setLoginState] = useState(props.menuID ? props.menuID : 1);
    const [cachedEmail, setCachedEmail] = useState("");
    const [cachedPassword, setCachedPassword] = useState("");
    const [error, setError] = useState(null);
    useEffect(() => {
        // Child components can setLoginState to 0, which means close the menu.
        if (loginState === 0) {
            props.closeFunc();
        }
        // If calling code specifies a menu and user attempts to change menu, close it.
        else if (props.menuID && props.menuID !== loginState) {
            props.closeFunc();
        }
    }, [loginState]);
    return (
        <div className="loginOverlay" onClick={() => {props.closeFunc()}}>
            <div className="loginPopup" onClick={(event) => { event.stopPropagation() }}>
                <img className="loginCloseIcon" src="/images/icons/iconCancel.png" alt="Close" onClick={() => { props.closeFunc() }} />
                {loginState === 1 && <LoginAccountUI setLoginState={setLoginState} setError={setError} cachedEmail={cachedEmail} setCachedEmail={setCachedEmail} cachedPassword={cachedPassword} setCachedPassword={setCachedPassword} />}
                {loginState === 2 && <CreateAccountUI setLoginState={setLoginState} />}
                {loginState === 3 && <SetupAccountUI setLoginState={setLoginState} error={error} />}
                {loginState === 4 && <ForgotPasswordUI setLoginState={setLoginState} email={props.email} />}
                {loginState === 5 && <DeleteAccountUI setLoginState={setLoginState} UserPreview={props.UserPreview} />}
            </div>
        </div>
    );
}
export default Authenticator;