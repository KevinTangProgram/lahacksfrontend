import React, { useState, useEffect } from 'react';

// Vars:
const date = new Date();

// Components:
export default function Clock(type) {
    const [time, setTime] = useState(getTime());
    const [date, setDate] = useState(getDate());
  
    useEffect(() => {
      const interval = setInterval(() => {
        setTime(getTime());
        setDate(getDate());
      }, 3000);
  
      // Cleanup function to clear the interval
      return () => clearInterval(interval);
    }, []);
  
    if (type.type === "time") {
        return <p className={type.className}>{time}</p>;
    }
    if (type.type === "date") {
        return <p className={type.className}>{date}</p>;
    }
    return <p>Hello Aaron</p>
  }

// Interface:
function getTimeData() {
    return date;
}
// Utils:
function getTime() {
    const timeString = date.toLocaleTimeString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true});
    return timeString;
}
function getDate() {
    const dateString = date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    return dateString;
}

export { getTimeData };