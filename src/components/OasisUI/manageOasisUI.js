import '../../CSS/Home.css';
import { useState, useEffect, useRef } from 'react';
import { OasisManager } from '../../utilities/oasisManager';
import { getHumanizedDate } from '../../utilities/utilities';
import Tooltip from '../tooltip';
import Loader from '../loader';
import '../../CSS/Login.css';

function ManageOasisUI(props) {
    // CreateOasisUI:
    if (props.type === "create") {
        if (!props.onSuccess || !props.closeFunc) {
            throw "Missing props";
        }
        return <CreateOasisUI onSuccess={props.onSuccess} closeFunc={props.closeFunc} />
    }
    // EditOasisUI:
    if (props.type === "edit") {
        if (!props.oasis || !props.onSuccess || !props.closeFunc) {
            throw "Missing props";
        }
        return <EditOasisUI oasis={props.oasis} onSuccess={props.onSuccess} closeFunc={props.closeFunc} />
    }
    // DeleteOasisUI:
    if (props.type === "delete") {
        if (!props.oasis || !props.onSuccess || !props.closeFunc) {
            throw "Missing props";
        }
        return <DeleteOasisUI oasis={props.oasis} onSuccess={props.onSuccess} closeFunc={props.closeFunc} />
    }

}
export default ManageOasisUI;

// The following 3 functions are used for ManageOasisUI:
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
                    props.closeFunc();
                    props.onSuccess(response);
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
                    <textarea style={{ "min-height": "4em", "resize": "none", "overflow": "auto" }} ref={inputRefDescription} type="text" name="description" autoComplete="off" placeholder="Description (Optional)" value={oasisDescription} onChange={handleChangeDescription} onKeyDown={(event) => {
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
                    <button className={loading ? "loginLargeButton lowOpacity" : "loginLargeButton"} onClick={() => { if (!loading) createNewOasis() }}>Create Oasis</button>
                    {/* Error Display: */}
                    {error && <p className="loginTextboxError">{error}</p>}
                    {/* Loading Display: */}
                    {loading && <Loader type="icon" />}
                </div>
            </div>
        </div>
    );
}
function EditOasisUI(props) {
    const oasis = props.oasis;
    // Setup:
    const [oasisTitle, setOasisTitle] = useState(oasis.info.title);
    const [oasisTitleError, setOasisTitleError] = useState(null);
    const inputRefTitle = useRef(null);
    const handleChangeTitle = (event) => { setOasisTitle(event.target.value); }
    const [oasisDescription, setOasisDescription] = useState(oasis.info.description);
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
    function editOasisInfo() {
        if (validateBoxes()) {
            setError(null);
            setLoading(true);
            OasisManager.editOasisInfo(oasis, oasisTitle, oasisDescription)
                .then((response) => {
                    setLoading(false);
                    props.closeFunc();
                    props.onSuccess();
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
                <h2>Rename Oasis</h2>
                <div className="selectGridSmall">
                    {/* Title */}
                    <input ref={inputRefTitle} type="text" name="title" autoComplete="off" placeholder="Title" value={oasisTitle} onChange={handleChangeTitle} onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            event.preventDefault();
                            if (validateBoxes()) {
                                inputRefDescription.current.focus();
                                inputRefDescription.current.selectionStart = inputRefDescription.current.value.length;
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
                    <textarea style={{ "min-height": "4em", "resize": "none", "overflow": "auto" }} ref={inputRefDescription} type="text" name="description" autoComplete="off" placeholder="Description (Optional)" value={oasisDescription} onChange={handleChangeDescription} onKeyDown={(event) => {
                        if (event.key === "Enter" && event.shiftKey) {
                            event.preventDefault();
                            setOasisDescription(oasisDescription + "\n")
                        }
                        else if (event.key === "Enter") {
                            event.preventDefault();
                            editOasisInfo();
                        }
                        else if (event.key === "Escape") {
                            event.preventDefault();
                            props.closeFunc();
                        }
                    }}></textarea>
                    {oasisDescriptionError && <p className="loginTextboxError">{oasisDescriptionError}</p>}
                    <br></br>
                    {/* Submit */}
                    <button className={loading ? "loginLargeButton lowOpacity" : "loginLargeButton"} onClick={() => { if (!loading) editOasisInfo() }}>Save</button>
                    {/* Error Display: */}
                    {error && <p className="loginTextboxError">{error}</p>}
                    {/* Loading Display: */}
                    {loading && <Loader type="icon"/>}
                </div>
            </div>
        </div>
    );
}
function DeleteOasisUI(props) {
    const oasis = props.oasis;
    // Setup:
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    function deleteOasis() {
        setError(null);
        setLoading(true);
        OasisManager.deleteOasis(oasis)
            .then((response) => {
                setLoading(false);
                props.closeFunc();
                props.onSuccess();
            })
            .catch(error => {
                setLoading(false);
                setError(error);
            })
    }
    // Output:
    return (
        <div className="loginOverlay" onClick={() => { props.closeFunc() }}>
            <div className="loginPopup" onClick={(event) => { event.stopPropagation() }}>
                <img className="loginCloseIcon" src="/images/icons/iconCancel.png" alt="Close" onClick={() => { props.closeFunc() }} />
                <h2>Delete Oasis</h2>
                {/* Show Preview Again:  */}
                <div className="oasisPreview">
                    {/* Content: */}
                    <div className="content">
                        <div className="title">{oasis.info.title}</div>
                        <div className="desc">
                            - {oasis.settings.sharing} oasis
                            <br></br>
                            - {oasis.stats.size.ideaCount} ideas
                            <br></br>
                            - edited {getHumanizedDate(oasis.stats.state.lastEditDate)}
                        </div>
                    </div>
                    {/* Buttons: */}
                    <div style={{ "display": "flex", "margin-left": "45%" }}>
                        <Tooltip text={oasis.info.description} />
                    </div>
                </div>
                <div className="selectGridSmall">
                    {/* Header */}
                    <p>Are you sure you want to delete this oasis? <br></br>This action cannot be undone.</p>                    
                    {/* Submit */}
                    <button className={loading ? "loginLargeButton lowOpacity" : "loginLargeButton"} onClick={() => { if (!loading) deleteOasis() }}>Delete Forever</button>
                    {/* Error Display: */}
                    {error && <p className="loginTextboxError">{error}</p>}
                    {/* Loading Display: */}
                    {loading && <Loader type="icon" />}
                    <br></br>
                </div>
            </div>
        </div>
    );
}