import React, { useState } from 'react';
import axios from 'axios';

const chemistrySeries = ["14 Series", "20 Series", "30 Series", "Upper Division", "Other"];

const images = ["chemistry.jpg", "biology1.jpg", "math1.jpg", "physics1.jpg", "compsci1.jpg"];

const tutoringChairs = "Arthur Huang and Claire Luong";

//const URL = "https://cheerful-frock-tick.cyclic.app";
const URL = "http://localhost:8080";

function startup()
{
    axios.get(URL + '/startup', {

    })
    .then (response => {
        return response.data;
    })
    .catch(console.error);
}

startup();

function Tutoring()
{
    const [studentName, setStudentName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [request, setRequest] = useState("");
    const [code, setCode] = useState("");

    const [tracker, setTracker] = useState("");
    const [counter, setCounter] = useState(0);
    const [subject, setSubject] = useState("");
    const [tutor, setTutor] = useState("");
    const [date, setDate] = useState("");

    let [classes, setClasses] = useState([]);
    let [tutorNames, setTutorNames] = useState([]);
    let [dateAndTime, setDateAndTime] = useState([]);
    let [responseTime, setResponseTime] = useState(false);

    const [checkName, setCheckName] = useState(false);
    const [checkEmail, setCheckEmail] = useState(false);
    const [checkBookings, setCheckBookings] = useState(0);
    const [checkCode, setCheckCode] = useState(0);

    const [error, setError] = useState(false);

    function fullClear()
    {
        setStudentName("");
        setEmail("");
        setPhone("");
        setRequest("");
        setCode("");
        setSubject("");
        setTutor("");
        setDate("");
        setClasses([]);
        setTutorNames([]);
        setDateAndTime([]);
    }

    function clearContents()
    {
        setStudentName("");
        setEmail("");
        setPhone("");
        setRequest("");
    }

    function changeTracker(name) {
        //console.log(counter);
        switch (counter)
        {
            case 1:
                setSubject(subject => name);break;
            case 2:
                setTutor(tutor => name);break;
            case 3:
                setResponseTime(false);
                setDate(date => name);break;
            default:
                break;
        }
        setCounter(counter => counter + 1);
    }

    function functionCall(nameCall)
    {
        switch (counter)
        {
            case 0:
                return getCourses(tracker, nameCall[0] + nameCall[1]);
            case 1:
                return getTutors(nameCall);
            case 2:
                return getDates(nameCall);
            default:
                return;
        }
    }

    function noAvailability()
    {
        if (counter === 3 && dateAndTime.length === 0 && responseTime)
        {
            return (<>
                <div className="selectGrid">
                    <p1 className="alignCenter">Sorry. There are no times available for {tutor}.</p1>
                </div>
            </>)
        }
        else if (counter === 1 && classes.length === 0 && responseTime)
        {
            return (<>
                <div className="selectGrid">
                    <p1 className="alignCenter">Sorry. There are no tutors available for {tracker.toLowerCase()}.</p1>
                </div>
            </>)
        }
        else if (counter === 2 && tutorNames.length === 0 && responseTime)
        {
            return (<>
                <div className="selectGrid">
                    <p1 className="alignCenter">Sorry. There are no tutors available for {subject}.</p1>
                </div>
            </>)
        }
        else if ((counter === 1 && classes.length === 0) || (counter === 2 && tutorNames.length === 0) || (counter === 3 && dateAndTime.length === 0))
        {
            return (
                <>
                    <div className="selectGrid">
                        <div className="loader"></div>
                    </div>
                </>)
        }
    }

    function Names({ name }) {
        return (
            <>
                <button className="selectCells" onClick={
                    () => {
                        functionCall(name);
                        changeTracker(name);
                        setResponseTime(false);
                    }
                }>
                    <p2>{name}</p2>
                </button>
            </>
        )
    }

    function Cards({cardArray})
    {
        return (
            <>
                <div className = "selectCells appointmentSubjectCells">
                    <div className = "appointmentGrid" onClick={() => {setTracker(tracker => "Delete"); setTutorNames(tracker => cardArray)}}>
                        <div className="appointmentFlex">
                            <img src={images[cardArray[5]]} alt="" className="fit"></img>
                        </div>
                        <div className="appointmentFlex">
                            <p1 className="subjectHeader">{cardArray[3]}</p1>
                            <p1 className="tutorHeader"><img src="tutor.png" alt="Tutor" ></img> {cardArray[2]}</p1>
                            <div className="tutorHeader"><p1 className="dateHeader">Date: </p1><p1>{cardArray[4]}</p1></div>
                        </div>
                        <div className="appointmentFlex deleteOutline">
                            <p1 className="deleteHeader deleteBox">Delete Appointment</p1>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    function PastCards({cardArray})
    {
        return (
            <>
                <div className = "selectCells appointmentSubjectCells pastAppointmentGrid">
                        <p1 className="pastSubjectHeader">{cardArray[3]}</p1>
                        <p1 className="pastTutorHeader"><img src="tutor.png" alt="Tutor" ></img> {cardArray[2]}</p1>
                        <div><p1 className="pastDateHeader">Date: </p1><p1>{cardArray[4]}</p1></div>
                </div>
            </>
        )
    }

    const handleChangeStudent = (event) => {setStudentName(event.target.value);}
    const handleChangeEmail = (event) => {setEmail(event.target.value);}
    const handleChangePhone = (event) => {setPhone(event.target.value);}
    const handleChangeRequest = (event) => {setRequest(event.target.value);}
    const handleChangeCode = (event) => {setCode(event.target.value);}

    function getArray()
    {
        switch (counter)
        {
            case 3:
                return dateAndTime;
            case 2:
                return tutorNames;
            case 1:
                return classes;
            case 0:
                return chemistrySeries;
            default:
                return;
        }
    }

    function getHeader()
    {
        switch (counter)
        {
            case 6:
                return <><button id="backButton" onClick={() => {
                    setCounter(counter => counter - 2);
                    setResponseTime(false);
                    setError(false);
                    }}>&#10094;Back</button><h1>Confirm Appointment</h1></>
            case 5:
                return <><button id="backButton" onClick={() => {
                    setCounter(counter => counter - 1);
                    setCheckCode(0);
                    setResponseTime(false);
                    setError(false);
                    setCode("");
                    }}>&#10094;Back</button><h1>Email Validation</h1></>
            case 4:
                return <><button id="backButton" onClick={() => {
                    clearContents();
                    setCounter(counter => counter - 1);
                    setCheckName(false);
                    setCheckEmail(false);
                    setResponseTime(false);
                    setError(false);
                    setCheckBookings(0);
                    }}>&#10094;Back</button><h1>Enter Information</h1></>
            case 3:
                return <><button id="backButton" onClick={() => {
                    setResponseTime(false);
                    setDateAndTime([]);
                    setCounter(counter => counter - 1);
                    }}>&#10094;Back</button><h1>Choose a Date and Time</h1></>
            case 2:
                return <><button id="backButton" onClick={() => {
                    setTutorNames([]);
                    setCounter(counter => counter - 1);
                    setResponseTime(false);
                    }}>&#10094;Back</button><h1>Choose a Tutor</h1></>
            case 1:
                if (tracker === "Chemistry")
                {
                    return <><button id="backButton" onClick={() => {
                        setClasses([]);
                        setCounter(counter => counter - 1);
                        setResponseTime(false);
                        }}>&#10094;Back</button><h1>Select a Class</h1></>
                }
                else
                {
                    return <><button id="backButton" onClick={() => {
                        setClasses([]);
                        setCounter(counter => counter - 1)
                        setTracker(tracker => "");
                        setResponseTime(false);
                        }}>&#10094;Back</button><h1>Select a Class</h1></>
                }
            case 0:
                return <><button id="backButton" onClick={() => {
                    setTracker(tracker => "");
                    }}>&#10094;Back</button><h1>Select a Series</h1></>
            default:
                return;
        }
    }

    function getCourses(number, secondary = "")
    {
        axios.get(URL + "/courselist", {
            params: {series: number, alternative: secondary},
        })
        .then (response => {
            //console.log(response);
            setClasses(response.data);
            setResponseTime(true);
        })
        .catch(console.error);
    }

    function getTutors(courseName)
    {
        axios.get(URL + "/tutorlist", {
            params: {series: courseName},
        })
        .then (response => {
            //console.log(response);
            setTutorNames(response.data);
            setResponseTime(true);
        })
        .catch(console.error);
    }

    function getDates(memberName)
    {
        axios.get(URL + "/datelist", {
            params: {memberName: memberName},
        })
        .then (response => {
            //console.log(response);
            setDateAndTime(response.data);
            setResponseTime(true);
        })
        .catch(console.error);
    }

    function checkInputs()
    {
        setCheckName(false);
        setCheckEmail(false);
        setCheckBookings(0);
        const processedEmail = email.toLowerCase();
        if (studentName === '')
        {
            setCheckName(true);
            //alert("You must enter a name");
            return;
        }
        if (!processedEmail.includes("@ucla.edu") && !processedEmail.includes("@g.ucla.edu"))
        {
            setCheckEmail(true);
            //alert("You must enter a UCLA email");
            return;
        }
        setResponseTime(true);
        axios.get(URL + '/checkemail', {
            params: {email: email,}
        })
        .then (response => {
            //console.log(response);
            switch (response.data)
            {
                case 0:
                    setCounter(counter => counter + 2);
                    break;
                case 1:
                    axios.post(URL + '/email/new', {
                        email: email,
                        student: studentName,
                    })
                    .then (response1 => {
                        //console.log(response1);
                        setCounter(counter => counter + 1);
                    })
                    .catch(console.error);
                    break;
                case 2:
                    setCheckBookings(2);
                    //alert("Cannot exceed four bookings in one month");
                    break;
                case 3:
                    setCheckBookings(3);
                    //alert("Cannot exceed two bookings in one week");
                    break;
                default:
                    break;
            }
            setResponseTime(false);
            setError(false);
        })
        .catch(() => {
            console.error();
            setError(true);
            setResponseTime(false);
        });
    }

    function resendCode()
    {
        setResponseTime(true);
        axios.post(URL + '/email/new', {
            email: email,
            student: studentName,
        })
        .then (response1 => {
            //console.log(response1);
            setCheckCode(1);
            setResponseTime(false);
            setError(false);
        })
        .catch(() => {
            console.error();
            setError(true);
            setResponseTime(false);
        });
    }

    function resendCodeButton()
    {
        if (!responseTime)
        {
            return (<>
            <button className="selectCells" id="resendCode" onClick={() => {
                resendCode();
            }}>Resend Code</button>
            </>)
        }
        else
        {
            return (<>
            <button className="selectCells lowOpacity" id="resendCode" onClick={() => {
                }}>Resend Code</button>
            </>)
        }
    }

    function verify()
    {
        setResponseTime(true);
        axios.get(URL + '/checkcode', {
            params: {email: email, code: code,}
        })
        .then (response => {
            //console.log(response);
            if (response.data)
            {
                setCounter(counter => counter + 1);
                setCode("");
                setCheckCode(0);
            }
            else
            {
                //alert("Invalid Code");
                setCheckCode(2);
            }
            setResponseTime(false);
            setError(false);
        })
        .catch(() => {
            console.error();
            setResponseTime(false);
            setError(true);
        });
    }

    function addPost()
    {
        setResponseTime(true);
        axios.post(URL + '/request/new', {
            student: studentName,
            email: email,
            phone: phone,
            request: request,
            tutor: tutor,
            subject: subject,
            date: date,
        })
        .then (response => {
            //console.log(response);
            setResponseTime(false);
            setError(false);
            setCounter(counter => counter + 1);
        })
        .catch(() => {
            console.error();
            setResponseTime(false);
            setError(true);
        });
    }

    function findAppointments()
    {
        setResponseTime(true);
        axios.get(URL + '/find/appointment', {
            params: {email: email}
        })
        .then (response => {
            //console.log(response);
            if (response.data[0].length === 0 && response.data[1].length === 0)
            {
                setCheckEmail(true);
            }
            else
            {
                setCheckEmail(false);
                setTracker(tracker => "AppointmentLayout");
                setClasses(response.data);
            }
            setResponseTime(false);
            setError(false);
        })
        .catch(() => {
            console.error();
            setResponseTime(false);
            setError(true);
        });
    }

    function checkId()
    {
        setResponseTime(true);
        axios.get(URL + '/find/appointment/info', {
            params: {info: tutorNames, code: code}
        })
        .then (response => {
            //console.log(response);
            if (response.data)
            {
                setTracker(tracker => "Confirmation");
                setCode("");
                setCheckCode(0);
            }
            else
            {
                setCheckCode(1);
            }
            setResponseTime(false);
            setError(false);
        })
        .catch(() => {
            console.error();
            setResponseTime(false);
            setError(true);
        })
    }

    function nameNotification()
    {
        if (checkName)
        {
            return <div><p1>Name</p1> <p1 className="redColor">(Invalid Name)</p1></div>
        }
        return <p1>Name</p1>
    }

    function emailNotification()
    {
        if (checkEmail)
        {
            return <div><p1>Email</p1> <p1 className="redColor">(Invalid UCLA email)</p1></div>
        }
        return <p1>Email</p1>
    }

    function connectionError()
    {
        if (error)
        {
            return <p1 className="alignCenter">There was an error with the connection. If this problem persists, please reload the page and try again.</p1>
        }
        return <></>
    }

    function emailSearch()
    {
        if (checkEmail)
        {
            return <p1 className="alignCenter">No appointments found with the provided email</p1>
        }
        return <div></div>
    }

    function bookingNotification()
    {
        switch (checkBookings)
        {
            case 2:
                return <p1 className="alignCenter">Cannot exceed four appointments per month</p1>
            case 3:
                return <p1 className="alignCenter">Cannot exceed two appointments per week</p1>
            default:
                return <div></div>
        }
    }

    function codeNotification()
    {
        switch(checkCode)
        {
            case 1:
                return <p1 className="alignCenter">A code has been resent. This may take a couple minutes.</p1>
            case 2:
                return <p1 className="alignCenter">Invalid Code</p1>
            default:
                return <div></div>
        }
    }

    function idNotification()
    {
        if (checkCode === 1)
        {
            return (<p1 className="alignCenter">Invalid Appointment ID</p1>)
        }
        return (<div></div>)
    }

    function axiosCall(alt)
    {
        switch (counter)
        {
            case 4:
                return checkInputs();
            case 5:
                return verify();
            case 6:
                return addPost();
            default:
                if (alt){return findAppointments();}
                else{return checkId();}
        }
    }

    function buttonName(first)
    {
        switch (counter)
        {
            case 4:
                return "Submit";
            case 5:
                return "Verify";
            case 6:
                return "Confirm";
            default:
                if (first){return "Search";}
                else{return "Submit";}
        }
    }

    function searchButton(first = true)
    {
        if (!responseTime)
        {
            return (<>
            <button className="selectCells" id="submitAndConfirm" onClick={() => {
                axiosCall(first)
                }}>{buttonName(first)}</button></>)
        }
        else
        {
            return (<>
            <button className="selectCells lowOpacity" id="submitAndConfirm" onClick={() => {
                }}>{buttonName(first)}</button></>)
        }
    }

    switch (tracker)
    {
        case "":
            return (
                <>
                    <h1>Welcome to Alpha Chi Sigma Tutoring</h1>
                    <div className="container">
                        <a href="https://www.chem.ucla.edu/axe/about.html"><img id="homeImage" src="coat.png" height="163.5" width="150" alt="CoatOfArms"/></a>
                    </div>
                    <h2>Make a Selection</h2>
                    <div className="subjectGrid">
                        <button className="subjectCells" id="chemistryPadding" onClick={() => {
                            setTracker(tracker => "Chemistry");
                        }}>
                            <p2>Chemistry</p2>
                        </button>
                        <button className="subjectCells" id="biologyPadding" onClick={() => {
                            setCounter(counter => counter + 1);
                            getCourses("Biology");
                            setTracker(tracker => "Biology");
                        }}>
                            <p2>Biology</p2>
                        </button>
                        <button className="subjectCells" id="mathPadding" onClick={() => {
                            setCounter(counter => counter + 1);
                            getCourses("Math");
                            setTracker(tracker => "Math");
                        }}>
                            <p2>Math</p2>
                        </button>
                        <button className="subjectCells" id="physicsPadding" onClick={() => {
                            setCounter(counter => counter + 1);
                            getCourses("Physics");
                            setTracker(tracker => "Physics");
                        }}>
                            <p2>Physics</p2>
                        </button> 
                        <button className="subjectCells" id="compSciPadding" onClick={() => {
                            setCounter(counter => counter + 1);
                            getCourses("Comp Sci");
                            setTracker(tracker => "CompSci");
                        }}>
                            <p2>Computer Science</p2>
                        </button>
                        <button className="subjectCells" id="appointmentPadding" onClick={() => {
                                setTracker(tracker => "Appointment");
                            }}>
                                <p2>View Bookings</p2>
                            </button>
                        <button className="subjectCells" id="officePadding" onClick={() => {
                                setTracker(tracker => "Office");
                            }}>
                                <p2>Office Hours</p2>
                            </button>
                        <button className="subjectCells" id="policiesPadding" onClick={() => {
                                setTracker(tracker => "Policies");
                            }}>
                                <p2>Policies</p2>
                            </button>
                    </div>
                    {/*uncomment below if these is an odd number of selections*/}
                    {/*
                    <div className="container">
                        <button className="subjectCells individual" id="policiesPadding" onClick={() => {
                            setTracker(tracker => "Policies");
                            }}>
                            <p2>Policies</p2>
                        </button>
                    </div>
                        */}
                </>
                )
        case "AppointmentLayout":
            return (
                <>
                    <button id="backButton" onClick={() => {
                        setTracker(tracker => "Appointment")
                        fullClear();
                        }}>&#10094;Back</button>
                    <h1>Your Appointments</h1>
                    <div className = "smallerContainer">
                        <p1 className="alignCenter smallGap">Upcoming Appointments</p1>
                        {classes[0].map((names) => (<div><Cards cardArray={names} /></div>))}
                        <p1 className="alignCenter smallGap">Past Appointments</p1>
                        {classes[1].map((names) => (<div><PastCards cardArray={names} /></div>))}
                    </div>
                </>
            )
        case "Delete":
            return (
                <>
                    <button id="backButton" onClick={() => {
                        setTracker(() => "AppointmentLayout");
                        setCheckCode(0);
                        setCode("");
                        setResponseTime(false);
                        setError(false);
                        }}>&#10094;Back</button>
                        <h1>Delete Appointment</h1>
                        <div className="selectGrid">
                            <p1 className = "alignCenter bottomMargin">Enter the appointment ID below</p1>
                            <input placeholder="Appointment ID" value={code} onChange={handleChangeCode}></input>
                            {idNotification()}
                        </div>
                        {connectionError()}
                        {searchButton(false)}
                </>
            )
        case "Confirmation":
            return (
                <>
                    <h1>Cancellation Successful!</h1>
                    <div className="selectGrid">
                        <p1 className="alignCenter">A confirmation of this cancellation has been sent to your email.</p1>
                    </div>
                    <button className="selectCells" id="submitAndConfirm" onClick={() => {
                    findAppointments();
                    setTracker("AppointmentLayout");
                    }}>Home</button>
                </>
            )
        case "Appointment":
            return (
                <>
                    <button id="backButton" onClick={() => {
                        setTracker("");
                        setCheckEmail(false);
                        setResponseTime(false);
                        setError(false);
                        clearContents();
                        }}>&#10094;Back</button>
                    <h1>View Bookings</h1>
                    <div className="selectGrid">
                        <p1 className="alignCenter">Enter your email below to view your appointments</p1>
                        <div className = "confirmGrid">
                            <p1>Email:</p1>
                            <input placeholder="UCLA Email" value={email} onChange={handleChangeEmail}></input>
                        </div>
                        {emailSearch()}
                        {connectionError()}
                        {searchButton()}
                    </div>
                </>
            )
        case "Office":
            return (
                <>
                    <button id="backButton" onClick={() => {
                        setTracker("");
                        }}>&#10094;Back</button>
                    <h1>Office Hours</h1>
                    <div className="selectGrid">
                        <p1 className="alignCenter">We hold drop-in tutoring sesisons (no appointment required) for our most requested subjects 
                            throughout the week from 6 to 7 pm in the Collaboratory, Young Hall 4222. The sessions held vary by the day 
                            of week so be sure to take note of the days that correspond to the classes of interest.</p1>
                            <br></br>
                        <div className="officeHoursGrid">
                            <p1>Tuesday</p1>
                            <p1>Life Science Series</p1>
                            <p1>Wednesday</p1>
                            <p1>Chemistry 14A & Chemistry 20A</p1>
                            <p1>Thursday</p1>
                            <p1>Chemistry 14B & Chemistry 20B</p1>
                            <p1>Friday</p1>
                            <p1>Organic Chemistry Series</p1>
                        </div>
                            <br></br><br></br>
                        <p1 className="alignCenter">
                        For more information, please contact {tutoringChairs} at tutoring.axsbg@gmail.com.
                        </p1>
                    </div>
                </>
            )
        case "Policies":
            return (
                <>
                    <button id="backButton" onClick={() => {
                        setTracker("");
                        }}>&#10094;Back</button>
                    <h1>Booking Policies</h1>
                    <div className="selectGrid">
                        <p1 className="alignCenter">Maximum of two appointments per week or four booking per month with each appointment being one hour. 
                            Timeslots with tutors can be reserved up to 7 days in advance and close 2 days prior to the start of the session.
                            <br></br><br></br><br></br>
                            For other inquiries, please contact {tutoringChairs} at tutoring.axsbg@gmail.com.
                            </p1>
                    </div>
                </>
            )
        default:
            switch (counter)
            {
                case 7:
                    return (
                        <>
                            <h1>Booking Successful!</h1>
                            <div className="selectGrid">
                                <p1 className="alignCenter">Please check your email for a confirmation on your tutoring appointment.</p1>
                            </div>
                            <button className="selectCells" id="submitAndConfirm" onClick={() => {
                            setTracker("");
                            setCounter(counter => 0);
                            fullClear();
                            }}>Home</button>
                        </>
                    )
                case 6:
                    return (
                        <>
                            {getHeader()}
                            <div className="selectGrid">
                                <p1 className="alignCenter">Appointment with {tutor} for {subject} on {date}</p1>
                                <div className="confirmGrid">
                                    <p1 className="selectReview">Name:</p1>
                                    <p1>{studentName}</p1>
                                    <p1 className="selectReview">Email:</p1>
                                    <p1>{email}</p1>
                                    <p1 className="selectReview">Phone:</p1>
                                    <p1>{phone}</p1>
                                </div>
                                {connectionError()}
                                {searchButton()}
                            </div>
                        </>)
                case 5:
                    return (
                        <>
                            {getHeader()}
                            <div className="selectGrid">
                                <p1 className="alignCenter">A code has been sent to {email}. Please enter the code below.</p1>
                                <div className="codeGrid">
                                    <input placeholder="6-digit code" value={code} onChange={handleChangeCode}></input>
                                    {resendCodeButton()}
                                </div>
                                {codeNotification()}
                                {connectionError()}
                                {searchButton()}
                            </div>
                        </>)
                case 4:
                    return (
                        <>
                            {getHeader()}
                            <div className="selectGrid">
                                {bookingNotification()}
                                {nameNotification()}
                                <input placeholder= "First and Last Name (required)" value={studentName} onChange={handleChangeStudent}></input>
                                {emailNotification()}
                                <input placeholder= "UCLA Email (required)" value={email} onChange={handleChangeEmail}></input>
                                <p1>Phone</p1>
                                <input placeholder= "Optional" value={phone} onChange={handleChangePhone}></input>
                                <p1>Requests</p1>
                                <input placeholder= "Optional" value={request} onChange={handleChangeRequest}></input>
                                {connectionError()}
                                {searchButton()}
                            </div>
                        </>)
                default:
                    return (
                        <>
                            {getHeader()}
                            <div className="selectGrid">{getArray().map((names) => (<div className="name"><Names name={names} /></div>))}</div>
                            {noAvailability()}
                        </>)
            }
    }
}

export default Tutoring;