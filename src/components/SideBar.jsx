import React, { useContext, useEffect } from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import NightlightIcon from '@mui/icons-material/Nightlight';
import SearchIcon from '@mui/icons-material/Search';
import ConversationsItem from './ConversationsItem';
import SmsIcon from '@mui/icons-material/Sms';
import { IconButton } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ExitToAppSharpIcon from '@mui/icons-material/ExitToAppSharp';
import LightModeIcon from '@mui/icons-material/LightMode';
// import {store} from '../Features/Store';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../Features/ThemeSlice';
import axios from "axios";
import { myContext } from "./MainContainer";
import { refreshSidebarFun } from '../Features/refreshSidebar';


// function createConversationsItem(item){
//   return (
//   <ConversationsItem
//       key={item.name}
//       name={item.name}
//       lastMessage={item.lastMessage}
//       timeStamp={item.timeStamp}
//   />)
// }

function SideBar() {
 const navigate = useNavigate();
 const [searchQuery, setSearchQuery] = useState('');

 /**redux toolkit logic***************************/
    //  console.log(useSelector((state) => state.themeKey));
    const dispatch = useDispatch(); // this is our dispatch function which is used to dispatch our action(after cliking the button which action should take)..
    // here we created one action into "reducer" which is "toggleTheme" is imported here..
    const lightTheme = useSelector((state) => state.themeKey); // this is our state value "true" or "false"

/************************************************/
//  const [lightTheme,setLightTheme] = useState(false);
  const [conversations,setConversations] = useState([]);
  const [showSmsSection, setShowSmsSection] = useState(false);
  // console.log(conversations);
  const userData = JSON.parse(localStorage.getItem("userData"));
  // const [refresh,setRefresh]=useState(true);
  const { refresh, setRefresh } = useContext(myContext);
 
  const handleInputChange = (event) => {
    // here i take the searchQuery..by targetting input field "value"..and update "searchQuery" state component..
    setSearchQuery(event.target.value);
    // console.log("mummy2" , event.target.value);
    // console.log("mummy2" , searchQuery);

  };
  useEffect(() => {
    if(!userData || !userData.data){
      console.log("User not Authenticated");
      navigate("/");
      return;
    }
    const user = userData.data;

    const config = {
      headers:{
        authorization: `Bearer ${user.token}`,
      },
    };
    const url = searchQuery
        ? `http://localhost:5000/chat/?search=${searchQuery}` // here we make a gate request with searchQuery to the server side
        : "http://localhost:5000/chat/";
        // console.log("mummy",searchQuery);
    axios.get(url,config).then((response) => {
      // this axios made a get request to "displayChat" function...to display chat..
      // and it take the response which is send by the displayChat function..
      // and update the conversation state component with "response" which is send back to frontend
      // by displayChat function in server side
      console.log("Data refresh in sidebar", response.data);
      setConversations(response.data);
    })
  },[refresh,searchQuery,conversations]);
  return (
    <div className={'sideBar-container' + (lightTheme ? "" : " dark")} >
      <div className={'sb-header' + (lightTheme ? "" : " dark")}> {/*when we add "dark" variable into this string using ternary operator then whole className put it under {} this bracket */}
        <div className='other-icons'>
          <IconButton onClick={()=>{navigate("/app/welcome")}}>
            <AccountCircleIcon className={(lightTheme ? "" : " dark")}/>
          </IconButton>
          <IconButton className='sms-icon'>
            <SmsIcon className={(lightTheme ? "" : " dark")}/>
          </IconButton>
          <IconButton onClick={()=>{navigate('users')}}>{/*on click the button call anonymous function in which we navigate to /users page */}
            <PersonAddIcon className={(lightTheme ? "" : " dark")}/>
          </IconButton>
          <IconButton onClick={()=>{navigate('groups')}}>
            <GroupAddIcon className={(lightTheme ? "" : " dark")}/>
          </IconButton>
          <IconButton onClick={()=>{navigate('create-groups')}}>
            <AddCircleIcon className={(lightTheme ? "" : " dark")}/>
          </IconButton>
          
          <IconButton onClick={()=>{dispatch(toggleTheme())}}> {/*this is dispatch our toggleTheme action when we click on the button
          in this toggleTheme action function we toggle the state value..see "ThemSlice.jsx" file  */}
          
          {
            /***another concept to toggle theme which is not work for whole app....
          onClick={()=> setLightTheme((theme) => {
            return !theme;
          })}
          on click it called anonymous function and in this function it's
          called hook's function "setLightTheme"...*/}

            {lightTheme===true && <NightlightIcon className={(lightTheme ? "" : " dark")}/>}
            {lightTheme===false && <LightModeIcon className={(lightTheme ? "" : " dark")}/>}
          </IconButton>
          <IconButton className={"con-title" + (lightTheme ? "" : " dark")} onClick = {()=>{localStorage.removeItem("userData");navigate("/")}}>
            <ExitToAppSharpIcon/>
          </IconButton>
        </div>
      </div>

      
      <div className={'sb-search '+ (lightTheme ? "" : " dark")}>
      <IconButton>
        <SearchIcon className={(lightTheme ? "" : " dark")}/>
      </IconButton>
        <input placeholder='search' value={searchQuery} onChange={handleInputChange} className={'search-box' + (lightTheme ? "" : " dark")}></input>
      </div>
      <div className={'sb-conversations' + (lightTheme ? "" : " dark")}>
        {/* <ConversationsItem /> */}
        {conversations.map((conversation,index) => {
          console.log("current conversations : ", conversation);
          var chatName ="";
          if(conversation.isGroupChat){
            chatName = conversation.chatName;
          }else{
            conversation.users.map((user)=>{
              if(user._id != userData.data._id){
                chatName=user.name;
              }
            });// this loop find the user except himself/herself..and this username except loged-in user should be displayed over the sideBar..
          }
          // when i refreshed it automatically display all chats of groups here because i not update the onClick event on groups.jsx file
          // remaining..
          {/* if(conversation.isGroupChat===false){
            if(userData.data.name === conversation.users[1].name){
              conversation_user_name = conversation.users[0].name;
              conversation_user_name_icon = conversation.users[0].name[0] ;
            }else{
              conversation_user_name = conversation.users[1].name;
              conversation_user_name_icon = conversation.users[1].name[0] ;
            }
          }else{
            conversation_user_name=conversation.chatName;
            conversation_user_name_icon=conversation.chatName[0];
          } */}
          {/* if(conversation.users.length === 1 && conversation.isGroupChat===false){
            return <div key={index}></div> // if in the conversation.users array has only one user then return only emty div..
          } */}
          if(!conversation.latestMessage){
            // if chat is recently created then..and no message interaction done
            // then this latestMessage field is not in the chatSchema so this if statement is run.. 
            console.log("No Latest Message with ", conversation.users[1]);
            return (
              <div
                key={index}
                onClick={() => {
                  console.log("Refresh fired from sidebar");
                  // dispatch(refreshSidebarFun());
                  setRefresh(!refresh);
                }}
              >
                <div
                  key={index}
                  className="conversation-container"
                  onClick={() => {
                    navigate(
                      "chat/" +
                        conversation._id + // this id is a chatid which is generated when the chatModel is created between two user for one to one chat
                        // and this id i later on used to delete the chat between two user...
                        "&" +
                        chatName
                    );
                    // when user click on the any user from sideBar with whom he/she created a chat..
                    // then new route in client side is created with chat/:_id..means after "chat/" this whatever is there
                    // it automatically replace with ":_id" example >> chat/conversation._id&conversation.users[1].name
                  }}
                  // dispatch change to refresh so as to update chatArea
                >
                  <p className={"con-icon" + (lightTheme ? "" : " dark")}>
                    {chatName[0]}  {/*taake the first character of name for icon */}
                  </p>
                  <p className={"con-title" + (lightTheme ? "" : " dark")}>
                  
                    {chatName} {/*display the name of the with whome loged-in user created chat */}
                  </p>

                  <p className="con-lastMessage">
                    No previous Messages, click here to start a new chat 
                  {/*so when latestMessage is not there means conversation is not started then this message is shown up as a latest message */}
                  </p>
                  {/* <p className={"con-timeStamp" + (lightTheme ? "" : " dark")}>
                {conversation.timeStamp}
              </p> */}
                </div>
              </div>
            );
          }else {
            return (
              <div
                key={index}
                className="conversation-container"
                onClick={() => {
                  navigate(
                    "chat/" +
                      conversation._id + // this is chatId when group conversation done...
                      "&" +
                      chatName
                  );
                }}
              >
                <p className={"con-icon" + (lightTheme ? "" : " dark")}>
                  {chatName[0]}
                </p>
                <p className={"con-title" + (lightTheme ? "" : " dark")}>
                  {chatName}
                </p>

                <p className="con-lastMessage">
                {console.log("latest message" ,conversation.latestMessage)}
                {conversation.latestMessage.content.length > 20 ? (
                    // If the content is longer than 20 characters, trim it down
                    <p>{conversation.latestMessage.content.substring(0, 20) + '...'}</p>
                  ) : (
                    // If the content is 20 characters or shorter, display it as is
                    <p>{conversation.latestMessage.content}</p>
                  )}
                  {/*only change in this else code is latest message is there then it display that latest message */}
                </p>
                <p className={"con-timeStamp" + (lightTheme ? "" : " dark")}>
                {conversation.timeStamp}
                12:21:3
              </p>
              </div>
            );
          }
        })}
      </div>
    </div>
  )
}

export default SideBar;