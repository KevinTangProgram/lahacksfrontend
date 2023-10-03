


// Interface:
export function copyToClipboard(text, onSuccess) {
    navigator.clipboard.writeText(text)
        .then(() => {
            if (onSuccess) {
                onSuccess();
            }
        })
        .catch((error) => {
            alert('Failed to copy text to clipboard.');
        });
}


