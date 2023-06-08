import LoginAccountUI from './loginAccountUI';
import CreateAccountUI from './createAccountUI';
import SetupAccountUI from './setupAccountUI';
import { useState } from 'react';


function Authenticator() {
    const [loginState, setLoginState] = useState(0);
    return (
        <div>
            <button onClick={() => {
                setLoginState(1);
            }}>login</button>
            {loginState === 1 && <LoginAccountUI setLoginState={setLoginState} />}
            {loginState === 2 && <CreateAccountUI setLoginState={setLoginState} />}
            {loginState === 3 && <SetupAccountUI setLoginState={setLoginState} />}
        </div>
    );
}
export default Authenticator;