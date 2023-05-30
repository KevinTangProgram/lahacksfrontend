import '../CSS/Test.css';
//
import GenerationOptionsUI from '../components/generateUI';
import ObserverComponent from '../components/observer';
import { MessageProcessor } from '../utilities/messageProcesser.js';



function Tab_oasis_notes(options) {
    // Notes display:
    function MessageDisplays() {
        return (<ObserverComponent dependencies={MessageProcessor.allOrganizedMessagesKey} Component={() => {
            {
                if (MessageProcessor.allOrganizedMessages.length === 0) {
                    return <div className="singleMessage">Your Oasis is Empty- Generate some notes!</div>;
                }
                return (
                    <div>
                        {MessageProcessor.allOrganizedMessages.map((message, i) => {
                            return (
                                <SingleMessage key={i} rawMessage={message} index={i}
                                    functions={{ }} />
                            )
                        })}
                    </div>
                );
            }
        }} />);
    }

    return (
        <div className="selectGrid">
            <MessageDisplays />
            <GenerationOptionsUI openUIByDefault={options.openUIByDefault} titleValue={options.titleValue}/>
        </div>
    );
}

export default Tab_oasis_notes;