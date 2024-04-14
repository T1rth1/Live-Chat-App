import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import "./css/mainContainer.css";
import { useSelector } from "react-redux";
import { set } from "mongoose";
import { createContext } from "react";
export const myContext = createContext();
function MainContainer(){
    //   console.log(conversations[0].name);
    const [refresh,setRefresh] = useState(true); // create a state component after passing as a context to our mainContainer..
    // so within this mainContainer we can use this state variable globally using "myContext"...
    const lightTheme = useSelector((state) => state.themeKey);
    return(
    <div className={"main-container"+ (lightTheme ? "" : " dark")}>
    {/*here i provide refresh state variable and setRefresh state function as a context respectively
    refresh and setRefresh */}
     <myContext.Provider value={{refresh:refresh,setRefresh:setRefresh}}> {/*cover our mainContainer component where we want to use context.. */}
        <SideBar/>
        <Outlet/>{/*for nesting route */}
    </myContext.Provider>
        {/* <CreateGroups/> */}
        {/* <Welcome/> */}
        {/* <ChatArea
        key={conversations[0].name}
        name={conversations[0].name}
        lastMessage={conversations[0].lastMessage}
        timeStamp={conversations[0].timeStamp}/> */}
        {/* <Users_Groups/> */}

    </div>)
}

export default MainContainer;