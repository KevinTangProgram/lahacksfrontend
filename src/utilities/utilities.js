// Dayjs (Date and Time Support)
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);




// Interface:
export function copyToClipboard(text, onSuccess) {
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
export function getHumanizedDate(date) {
    const dayjsDate = dayjs(date);
    return dayjsDate.fromNow();
} 

