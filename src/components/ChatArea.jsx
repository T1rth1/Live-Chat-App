import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, Skeleton } from '@mui/material'
import SendIcon from '@mui/icons-material/Send';
import React, { useContext, useEffect, useRef, useState } from 'react'
import MessageOther from './MessageOther';
import MessageSelf from './MessageSelf';
import { useSelector } from 'react-redux';
import {motion} from "framer-motion";
import { AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { myContext } from "./MainContainer";
import io from "socket.io-client";

var socket,chat;
function ChatArea(props) {
    const navigate = useNavigate();
    const lightTheme = useSelector((state) => state.themeKey); 
    const [messageContent, setMessageContent] = useState("");
    const messagesEndRef = useRef(null);
    const dyParams = useParams();
    const [chat_id,chat_user] = dyParams._id.split("&"); // this chat_id and chat_user we get from the link....chat_user is user which is reciever or with whom loged-in user start a chat..
    // when loged-in user clicked on particular user then it head over(naviaget) to the new page(see SideBar.jsx file)..
    // for this we used "dyParams" function of the "react-router-dom"..
    const userData = JSON.parse(localStorage.getItem("userData"));
    const [allMessages, setAllMessages] = useState([]);
    const [allMessagesCopy, setAllMessagesCopy] = useState([]);
    const [loaded, setloaded] = useState(false);
    const { refresh, setRefresh } = useContext(myContext);
    const[socketConnectionStatus,setSocketConnectionStatus] = useState(false);
    const handleGroupExitButtonClick = async () => {
      const config = {
        headers: {
          authorization: `Bearer ${userData.data.token}`,
        },
      };
  
      try {
        // Make a request to the groupExit endpoint
        await axios.put("http://localhost:5000/chat/groupExit", {
          chatId: chat_id,
          userId: userData.data._id,
        }, config);
  
        navigate("/app/welcome");
        console.log('User exited group successfully');
        // Optionally, you can update the UI or perform other actions after exit
      } catch (error) {
        console.error('Failed to exit group', error.response.data);
        // Handle error scenarios
      }
    };

    const handleDeleteButtonClick = async () => {
        const config = {
          headers: {
            authorization: `Bearer ${userData.data.token}`,
          },
        };
        
        await axios.delete("http://localhost:5000/message/delete/" + chat_id, config)
          .then(() => {
            navigate("/app/welcome")
            console.log('Chat records deleted successfully');
            // Optionally, you can update the UI or perform other actions after deletion
          })
          .catch((error) => {
            console.error('Failed to delete chat records', error.response.data);
            // Handle error scenarios
          });
      };
    const sendMessage = () => {
      var data = null;
        const config = {
            headers : {
                authorization : `Bearer ${userData.data.token}`,
            },
        };
        axios.post("http://localhost:5000/message/",
        {
            content : messageContent,
            chatId : chat_id,
        }, //  we send the content and chatId with this post request to server side...chatId extract from the link using "dyParams" function..
        // it create a message model..
        config
        ).then(({ response }) => {
            data = response;
            console.log(data);
            console.log("Message Fired from client side");
        })
        .catch(error => {
            console.error("Error creating group:", error.response.data);
            // Handle the error appropriately
          });
          // socket.emit("newMessage",data);
    };

    // // connect to socket
    // useEffect(() => {
    //   socket = io("http://localhost:5000");
    //   socket.emit("setup",userData);
    //   socket.on("connection", () => {
    //     setSocketConnectionStatus(!socketConnectionStatus)
    //   })
    // }, []);

    // // new message recieved
    // useEffect(() => {
    //   socket.on("message recieved", (newMessage) => {
    //     if(!allMessagesCopy || allMessagesCopy._id !== newMessage._id) {

    //     }else{
    //       setAllMessages([...allMessages],newMessage);
    //     }
    //   });
    // });

    // fetch chats
    useEffect(()=>{
        // console.log("ChatArea refreshed!");
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
        const config = {
            headers : {
                authorization : `Bearer ${userData.data.token}`,
            },
        };
        axios.get("http://localhost:5000/message/"+chat_id,config) // make a get request on the message/:chatId route..and allMessages function is called in server side..
        .then(({ data }) => {
            // console.log("dataaaaaaaaa",data);
            setAllMessages(data); // and this "allMessages" function send back the "response" and we set the state
            // with this "data"(response which we get from the server side)
            setloaded(true);
            // socket.emit("join chat",chat_id);
        });
        setAllMessagesCopy(allMessages);
    },[refresh,chat_id,userData.data.token,allMessages]); // when the refresh variable,chat_id,token of loged-in user is changed then this function is called..


    if (!loaded) {
        return (
          <div
            style={{
              border: "20px",
              padding: "10px",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <Skeleton
              variant="rectangular"
              sx={{ width: "100%", borderRadius: "10px" }}
              height={60}
            />
            <Skeleton
              variant="rectangular"
              sx={{
                width: "100%",
                borderRadius: "10px",
                flexGrow: "1",
              }}
            />
            <Skeleton
              variant="rectangular"
              sx={{ width: "100%", borderRadius: "10px" }}
              height={60}
            />
          </div>
        );
      } else {
        
        // if we get the response and state varible("allMessages") is loaded with response(data)..
        // then this else statement is triggererd..and return below content
        return (
          <div className={"chatArea-container" + (lightTheme ? "" : " dark")}>
            <div className={"chatArea-header" + (lightTheme ? "" : " dark")}>
              <p className={"con-icon" + (lightTheme ? "" : " dark")}>
                {chat_user[0]}
              </p>
              <div className={"header-text" + (lightTheme ? "" : " dark")}>
                <p className={"con-title" + (lightTheme ? "" : " dark")}>
                  {chat_user} {/*chatArea's title is reciever user name  */}
                </p>
                {/* <p className={"con-timeStamp" + (lightTheme ? "" : " dark")}>
                  {props.timeStamp}
                </p> */}
              </div>
              
              {/* {console.log("mam fuck you!",allMessages[0].chat.groupAdmin)} */}
              {allMessages.map((message, index) => {
                  // Check if it's the first message
                  const isFirstMessage = index === 0; // it is used to render the icon for only once otherwise it display the icon no. message are there in the allMessages array..
                  // so we use index property here it display icon for the first message..
                  // from this first message i verify whether it is groupChat or not if yes then i check if it is admin or not if yes then delete icon show up
                  // and if one to one chat ther (isGroupChat==false) that time also delete icon show up..only when participant is in the group then exit icon show up
                  // for that participant(user)..

                  if (isFirstMessage) {
                    if(!message.chat){
                      navigate("/app/welcome");
                    }else{
                    const groupAdminId = message.chat.groupAdmin;
                    const self_id1 = userData.data._id;
                    const isGroupChat = message.chat.isGroupChat;

                    return (
                      <IconButton key={index}>
                        {isGroupChat && groupAdminId === self_id1 || !isGroupChat ? <DeleteIcon onClick={()=>{handleDeleteButtonClick();setRefresh(!refresh);}}/> : <ExitToAppIcon onClick={()=>{handleGroupExitButtonClick();setRefresh(!refresh);}}/>}
                        {/*when we click on the exit or delete button then it change the refresh variable and in sideBar.jsx file it trigger the useEffect and re-render the chats
                        on sidebar function */}
                      </IconButton>
                    );
                  }
                  }

                  // Return null for subsequent messages
                  return null;
                })}
                 {/* this is for when group is there then user can not delete the group..this
                delete functionality is aplicable only one to one chat for group we have exist functionality.. */}
            </div>
            <div className={"message-container" + (lightTheme ? "" : " dark")}>
              {allMessages
                .slice(0)
                .map((message, index) => { // used to display all messages..with this particular user("chat_user")..
                  const sender = message.sender; // take the sender object of message object
                  const self_id = userData.data._id; // take the id of loged-in user..
                  console.log(sender._id);
                  console.log(self_id);
                  if (sender._id === self_id) { // if sender's id and loged-in user's id match means we should load this message to the right so "messagSelf" component called..
                    console.log("I sent it ");
                    return <MessageSelf messageSelf={message} key={index} />; // if the sender's id and the loged-in user's id is same then this if statement 
                  } else { // if sender's id in message object is different then current logged-in user id then we should only render the message to the left of chatArea-container so "messageOther" component is called...
                    // console.log("Someone Sent it");
                    // in this statement we pass the "message" response as a props to the MessageOthers.jsx file... 
                    return <MessageOther messageOther={message} key={index} />;
                  }
                })}
            </div>
            <div ref={messagesEndRef} className="BOTTOM" />
            <div className={"text-input-area" + (lightTheme ? "" : " dark")}>
              <input
                placeholder="Type a Message"
                className={"search-box" + (lightTheme ? "" : " dark")}
                value={messageContent} // value  = we keep what ever message entered by the user
                onChange={(e) => {
                  setMessageContent(e.target.value); // what ever the value entere in the input box..it update the state messageContent with it...
                  // and later on this messageContent passed with the post request and in server side it create a new message model with this new message which is
                  // wrote in this input box..
                }}
                onKeyDown={(event) => {
                  if (event.code == "Enter") {
                    // console.log(event);
                    sendMessage();
                    setMessageContent("");
                    setRefresh(!refresh); // when the message get sended then also we toggle the refresh variable so above useEffect function called..
                    // and it fetch the new message because we called senMessage() function before it so it created new message schema and we fetch it and update the 
                    // latest message in server side so in sidebar latesMessage is also changed dynamically...
                  }
                  // this is for when user click on the "Enter" button..then it trigger sendMessage() function..
                  //  and make the state "messageContent" so what ever message was on the search bar is set to empty because
                  //  we keep searchBar's value = {messageContent}...
                }}
              />
              <IconButton
                className={"icon" + (lightTheme ? "" : " dark")}
                onClick={() => {
                  sendMessage();
                  setMessageContent(""); // when message sended then we make this state variable empty so searchBar's value also set to empty..which is good..
                  setRefresh(!refresh);
                }}
                // it call the function sendMessage() when the user click the send button...
              >
                <SendIcon />
              </IconButton>
            </div>
          </div>
        );
      }

}

export default ChatArea;