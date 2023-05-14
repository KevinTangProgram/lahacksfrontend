import React, { useState, useEffect } from 'react';

// Vars:

// Components:
export default function Clock(props) {
    const [time, setTime] = useState(getTime());
    const [date, setDate] = useState(getDate());
  
    useEffect(() => {
      const interval = setInterval(() => {
        const date = new Date();
        const timeString = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
        const dateString = date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
        setTime(timeString);
        setDate(dateString);
      }, 3000);
  
      // Cleanup function to clear the interval
      return () => clearInterval(interval);
    }, []);
  
    if (props.type === "time") {
        return <p className={props.className}>{time}</p>;
    }
    if (props.type === "date") {
        return <p className={props.className}>{date}</p>;
    }
    return <p>Hello Aaron</p>
  }

// Interface:
function getTimeData() {
    return date;
}
// Utils:
function getTime() {
  const date = new Date();
  const timeString = date.toLocaleTimeString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true});
  return timeString;
}
function getDate() {
  const date = new Date();
  const dateString = date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  return dateString;
}

export { getTimeData, getTime, getDate };