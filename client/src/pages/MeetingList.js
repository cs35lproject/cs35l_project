import { useLocation, useSearchParams, useNavigate, createSearchParams } from 'react-router-dom';
import { handleClientLoad, handleAuthClick } from '../components/CalendarAPI';
import React, { useState, useEffect } from 'react';

import Navbar from "../components/Navbar"
import './style.css';

export default function Meeting() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [userID, setUserID] = useState(state ? state.userID : null);
  const [meetingID, setMeetingID] = useState(state ? state.meetingID : null);
  const [userMeetings, setUserMeetings] = useState();

  useEffect(() => {
    handleClientLoad((calendars, events, primaryEmail) => {
      setUserID(primaryEmail);
    })
    if (localStorage.getItem("userID")) {
      console.log(localStorage.getItem("userID"))
      setUserID(localStorage.getItem("userID"))
    }
  }, []);

  useEffect(() => {
    console.log("MeetingList useEffect getuser")
    getUser();
  }, [userID])
  
  // Get user from backend and update userMeetings hook
  const getUser = async () => {
    console.log("MeetingList getUser, userID:", userID)
    if (userID !== null) {
      await new Promise(r => setTimeout(r, 400));
      if (userID !== undefined) {
        let url = `${process.env.REACT_APP_BACKEND}/user/getUserMeetings?userID=${userID}`
        let metadata = { method: "GET" }
        console.log("url:", url)
        try {
            const response = await fetch(url, metadata)
            const data = await response.json()
            console.log("data:", data)
            if (data.userID !== null && data.userMeetings !== null) {
              console.log("setting to:", data.user.meetingIDs)
              setUserMeetings(data.user.meetingIDs)
            }
        } catch (error) {
            console.log(error);
        }
      } 
    }
  }

  const displayMeetingIDs = () => {
    console.log("userMeetings:", userMeetings)
    let meetings = []
    let link = ""
    for (let meetingKey in userMeetings) {
      link = `${window.location.origin}/meeting?id=${userMeetings[meetingKey]}`
      meetings.push(<div><a href={link} key={meetingKey}>{link}</a></div>)
    }
    console.log("meetings:", meetings)
    return meetings
  }

  return (
    <React.Fragment>
      <div>
        <Navbar handleAuthClick = {handleAuthClick}/>
      </div>

      <p>Hi, {userID}. Here are your meetings:</p>

      <div>
        {displayMeetingIDs()}
      </div>

  
    </React.Fragment>
  )
}