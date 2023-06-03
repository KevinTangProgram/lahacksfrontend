
import axios from 'axios';

const URL = 'http://localhost:8080';

//CREATED THIS FILE TO TO TEST MY OWN FUNCTIONS WITHOUT INTERFEREING WITH THE REST OF THE CODE

let rawMessage = ["hello world"]

function callApi()
{
    axios.put(URL + '/oasis/promptx1', {
        rawMessage: rawMessage,
    })
    .then (response => {
        console.log(response.data);
    })
    .catch(error => {
        console.log(error);
    });
}

export default function Kevin() {
    return (
        <>
            <button onClick={() => {callApi()}}>Click Here</button>
        </>
    )
}
