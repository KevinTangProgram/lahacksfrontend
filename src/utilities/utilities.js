//

function copyToClipboard(text, onSuccess) {
    navigator.clipboard.writeText(text)
        .then(() => {
            if (onSuccess) {
                onSuccess();
            }
            console.log('Text copied to clipboard');
        })
        .catch((err) => {
            console.error('Failed to copy text: ', err);
        });
}

export default copyToClipboard;
