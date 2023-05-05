//


// Vars:
const date = new Date();

// Time:
function GetTime() {
    const timeString = date.toLocaleTimeString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true});
    console.log(timeString);
    return timeString;
}
function GetDate() {
    const dateString = now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    return dateString;
}

export { GetTime, GetDate };
