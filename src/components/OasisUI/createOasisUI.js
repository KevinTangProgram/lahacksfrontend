import '../../CSS/Home.css';
import { useState, useEffect, useRef } from 'react';
import { OasisManager } from '../../utilities/oasisManager';
import '../../CSS/Login.css';



function CreateOasisUI(props) {
    // Setup:
    const [oasisTitle, setOasisTitle] = useState("");
    const [oasisTitleError, setOasisTitleError] = useState(null);
    const inputRefTitle = useRef(null);
    const handleChangeTitle = (event) => { setOasisTitle(event.target.value); }
    const [oasisDescription, setOasisDescription] = useState("");
    const [oasisDescriptionError, setOasisDescriptionError] = useState(null);
    const inputRefDescription = useRef(null);
    const handleChangeDescription = (event) => { setOasisDescription(event.target.value); }
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        inputRefTitle.current.focus();
    }, []);
    const validateBoxes = () => {
        let valid = true;
        let focus = null;
        // Title checks:
        const titleCheck = OasisManager.validateInput("title", oasisTitle);
        if (titleCheck !== true) {
            setOasisTitleError(titleCheck);
            valid = false;
            if (!focus) {
                focus = "title";
            }
        }
        else {
            setOasisTitleError(null);
        }
        // Description checks:
        const descriptionCheck = OasisManager.validateInput("description", oasisDescription);
        if (descriptionCheck !== true) {
            setOasisDescriptionError(descriptionCheck);
            valid = false;
            if (!focus) {
                focus = "description";
            }
        }
        else {
            setOasisDescriptionError(null);
        }
        //
        switch (focus) {
            case "title":
                inputRefTitle.current.focus();
                break;
            case "description":
                inputRefDescription.current.focus();
                break;
        }
        return valid;
    }
    function createNewOasis() {
        if (validateBoxes()) {
            setError(null);
            setLoading(true);
            OasisManager.createNewOasis(oasisTitle, oasisDescription)
                .then((response) => {
                    setLoading(false);
                    props.navFunc(response);
                })
                .catch(error => {
                    setLoading(false);
                    setError(error);
                })
        }
    }
    // Output:
    return (
        <div className="loginOverlay" onClick={() => { props.closeFunc() }}>
            <div className="loginPopup" onClick={(event) => { event.stopPropagation() }}>
                <img className="loginCloseIcon" src="/images/icons/iconCancel.png" alt="Close" onClick={() => { props.closeFunc() }} />
                <h2>New Oasis</h2>
                <div className="selectGridSmall">
                    {/* Title */}
                    <input ref={inputRefTitle} type="text" name="title" autoComplete="off" placeholder="Title" value={oasisTitle} onChange={handleChangeTitle} onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            event.preventDefault();
                            if (validateBoxes()) {
                                inputRefDescription.current.focus();
                            }
                        }
                        else if (event.key === "Escape") {
                            event.preventDefault();
                            props.closeFunc();
                        }
                    }}></input>
                    {oasisTitleError && <p className="loginTextboxError">{oasisTitleError}</p>}
                    <br></br>
                    {/* Description */}
                    <textarea style={{"min-height" : "4em", "resize" : "none", "overflow" : "auto"}} ref={inputRefDescription} type="text" name="description" autoComplete="off" placeholder="Description (Optional)" value={oasisDescription} onChange={handleChangeDescription} onKeyDown={(event) => {
                        if (event.key === "Enter" && event.shiftKey) {
                            event.preventDefault();
                            setOasisDescription(oasisDescription + "\n")
                        }
                        else if (event.key === "Enter") {
                            event.preventDefault();
                            createNewOasis();
                        }
                        else if (event.key === "Escape") {
                            event.preventDefault();
                            props.closeFunc();
                        }
                    }}></textarea>
                    {oasisDescriptionError && <p className="loginTextboxError">{oasisDescriptionError}</p>}
                    <br></br>
                    {/* Submit */}
                    <button className="loginLargeButton" onClick={() => { createNewOasis() }}>Create Oasis</button>
                    {/* Error Display: */}
                    {error && <p className="loginTextboxError">{error}</p>}
                    {/* Loading Display: */}
                    {loading && <div className="loader"></div>}
                </div>
            </div>
        </div>
    );
}
export default CreateOasisUI;