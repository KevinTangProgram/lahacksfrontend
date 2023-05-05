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
        return <p1 className={type.className}>{time}</p1>;
    }
    if (type.type === "date") {
        return <p1 className={type.className}>{date}</p1>;
    }
    return <p1>Hello Aaron</p1>
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