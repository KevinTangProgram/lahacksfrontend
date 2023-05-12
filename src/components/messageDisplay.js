import '../CSS/Test.css';
import '../CSS/Tab_oasis.css';

function messageDisplay({input, deleteThought}) {

    if (input.length === 0) {
        return <div className="singleMessage">Your Oasis is Empty- Add some ideas!</div>;
    }
    return (
        <div>
            {input.map((message, i) => {
                const lines = input[i].split('\n');
                return (
                    <div className="singleMessage" key={i + MessageProcessor.sessionIndex} id={i + MessageProcessor.sessionIndex}>
                        <img className="iconTrash" src="./images/icons/iconTrash.png" alt="Delete" onClick={() => { deleteThought(); }} />
                        {lines.map((line, j) => (
                            <div key={j}>{line}</div>
                        ))}
                    </div>
                );
            })}
        </div>
    );
}

export default messageDisplay;