import '../CSS/Tab_oasis.css';

function SingleMessage(props) {
    const rawMessage = props.rawMessage;
    const functions = props.functions;
    const lines = rawMessage.content.split('\n');
    return (
        <div className="singleMessage" id={props.index}>
            <div className="messageBanner">
                <p className="iconDesc">{rawMessage.sender} at {rawMessage.timestamp}</p>
                <img className="iconCopy" src="./images/icons/iconCopy.png" alt="Copy" onClick={() => { }} />
                <img className="iconEdit" src="./images/icons/iconEdit.png" alt="Edit" onClick={() => { functions.edit(props.index); }} />
                <img className="iconTrash" src="./images/icons/iconTrash.png" alt="Delete" onClick={() => { functions.delete(props.index); }} />
            </div>
            <div className="messageContent">
                {lines.map((line, j) => (
                    <div key={j}>{line}</div>
                ))}
            </div>
        </div>
    );
}

export default SingleMessage;