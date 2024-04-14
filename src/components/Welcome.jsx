import React from 'react'
import chatLogo from "./4912113.webp";
import { useNavigate } from 'react-router-dom';
import {  useSelector } from 'react-redux';

function Welcome() {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const lightTheme = useSelector((state) => state.themeKey); 

  const navigate = useNavigate();
  if(!userData || !userData.data){
    console.log("User not Authenticated");
    navigate("/");
    return;
  }
  return (  
    <div className='welcome-container'>
        <img src={chatLogo} alt="Logo" className='welcome-logo'/>
        <b className={(lightTheme ? "" : " dark")} >Hi, {userData.data.name} 👋 </b>
        <p className={(lightTheme ? "" : " dark")} >View and text directly to people present in the chat Rooms.</p>
    </div>
  )
}

export default Welcome;