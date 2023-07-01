import LoginAccountUI from './loginAccountUI';
import CreateAccountUI from './createAccountUI';
import SetupAccountUI from './setupAccountUI';
import ForgotPasswordUI from './forgotPasswordUI';
import { useState } from 'react';


function Authenticator() {
    const [loginState, setLoginState] = useState(0);
    const [cachedEmail, setCachedEmail] = useState(null);
    const [cachedPassword, setCachedPassword] = useState(null);
    const [error, setError] = useState(null);
    return (
        <div>
            <button onClick={() => {
                setLoginState(1);
            }}>login</button>
            {loginState === 1 && <LoginAccountUI setLoginState={setLoginState} setError={setError} cachedEmail={cachedEmail} setCachedEmail={setCachedEmail} cachedPassword={cachedPassword} setCachedPassword={setCachedPassword}/>}
            {loginState === 2 && <CreateAccountUI setLoginState={setLoginState} />}
            {loginState === 3 && <SetupAccountUI setLoginState={setLoginState} error={error} />}
            {loginState === 4 && <ForgotPasswordUI setLoginState={setLoginState} />}
        </div>
    );
}
export default Authenticator;