import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import ChatArea from "./ChatArea";
import CreateGroups from "./CreateGroups";
import Login from "./Login";
import MainContainer from "./MainContainer";
import Users from "./Users";
import Groups from "./Groups";
import Welcome from "./Welcome";
import SideBar from "./SideBar";
// import "./css/app.css";
// here we import contacts as a contacts constant from contacts.js file and use it here

function App() {
    const [conversations,setConversations] = useState([
        {
          name:"test#1",
          lastMessage:"Last Message #1",
          timeStamp:"today",
        },
        {
          name:"test#2",
          lastMessage:"Last Message #2",
          timeStamp:"today",
        },
        {
          name:"test#3",
          lastMessage:"Last Message #3",
          timeStamp:"today",
        }
      ]);
 return(
 
 <div className="App">
 {/* <MainContainer/> */}
 {/* <Login/> */}
 <Routes>
    <Route path="/" element={<Login/>}/>
    <Route path="app" element={<MainContainer/>}>
        <Route path="welcome" element={<Welcome/>}></Route>
        <Route path="chat/:_id" element={<ChatArea/>}></Route>
        <Route path="users" element={<Users/>}></Route>
        <Route path="Groups" element={<Groups/>}></Route>
        {/* <Route path="groups" element={<Groups/>}></Route> */}
        <Route path="create-groups" element={<CreateGroups/>}></Route>
    </Route>
 </Routes>

 </div>
 
 );
}

export default App;
