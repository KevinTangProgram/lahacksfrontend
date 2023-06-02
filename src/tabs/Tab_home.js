import '../CSS/Test.css';
//
import { useNavigate } from 'react-router-dom';



function Tab_home({setCurrentTab}) {
    const navigate = useNavigate();

    return (
        <div className="backGround alignCenter">
            <h2>Welcome, Guest User</h2>
            <p>Your Oases:</p>
            <button className="debugger-popup-button" onClick={() => {
                navigate('/oasis/1');
                setCurrentTab(["tabActive", "tabInactive"])
            }}> + </button>
            <button className="debugger-popup-button" onClick={() => {
                navigate('/oasis/2');
                setCurrentTab(["tabActive", "tabInactive"])
            }}> Unamed Oasis </button>
            <div class="loader"></div>
        </div>
    );
}

export default Tab_home;