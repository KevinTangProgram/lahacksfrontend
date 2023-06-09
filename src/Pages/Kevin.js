
import axios from 'axios';

const URL = 'http://localhost:8080';

//CREATED THIS FILE TO TO TEST MY OWN FUNCTIONS WITHOUT INTERFEREING WITH THE REST OF THE CODE

let rawMessage = ["Acid-Base Equilibria",
"At 1 pH higher (1 order of magnitude less H+), 1:10 HA/A-",
"At acid pKa, 1:1 HA/A-.",
"At 1 pH lower (1 order of magnitude more H+), 10:1 HA/A-",
"Henderson Hasselback: pH=pKa+log(A-/HA)",
"Can be used to find the pH of a buffer solution.",
"pI: average the two pKas around the neutral range (when molecule is zwitterion)",
"If you are at carboxy pKa, its actually closer to 0.5 net charge (not all of the molecules have COO-, but they definitely have NH3+).",
"If you are at amino pKa, its actually closer to -0.5 net charge (all molecules have COO-, but not all have NH3+).",
"other pH facts",
"As pH range decreases, you have more positive charge.",
"pH can sometimes vary in the body.",
"Amino acids have a basic and acidic end",
"They are the building blocks of proteins",
"there are two types of substitution reactions: sn1 and sn2.",
"sn1 reactions happen faster than sn2 reactions."
]

function callApi()
{
    axios.put(URL + '/oasis/generate/promptx2/noheader', {
        rawMessage: rawMessage,
        header: "Acid-Base Equilibria",
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
            <div style={{"display": "flex", "width": "100%"}}>
                <button style={{"margin-left": "auto", "margin-right": "auto"}}onClick={() => {callApi()}}>Click Here</button>
            </div>
            
        </>
    )
}
