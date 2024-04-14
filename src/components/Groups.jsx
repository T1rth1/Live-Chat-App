import React, { useContext, useEffect, useState } from 'react'
import chatLogo from "./live-chat_512px.png"
import { IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshSharpIcon from '@mui/icons-material/RefreshSharp';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useDispatch, useSelector } from 'react-redux';
import {motion} from "framer-motion";
import { AnimatePresence } from 'framer-motion';
import { createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { refreshSidebarFun } from "../Features/refreshSidebar"
import axios from 'axios';
import { myContext } from "./MainContainer";

function Groups() {
    // same code as user.jsx where we display online(awailable) users....
    const {refresh , setRefresh} = useContext(myContext);
    const dispatch = useDispatch();
    const lightTheme = useSelector((state) => state.themeKey); // now we can use this state variable "lightTheme" everywhere..
    // dispatch function is used only on button which is responsible to toggle theme.. 
    const [allGroups , setGroups] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const userData = JSON.parse(localStorage.getItem("userData")); // This line retrieves the "userData" from the localStorage and parses it as JSON. 
    // which was previously stored as a JSON string.
    const navi = useNavigate();
    if(!userData){
        console.log("User not Authenticated");
        navi("/"); //  uses nav(-1) to navigate back in the browser history.
    }
    const handleInputChange = (event) => {
        // here i take the searchQuery..by targetting input field "value"..and update "searchQuery" state component..
        setSearchQuery(event.target.value);
        console.log(event.target.value);
    };
    // useEffect accepts two arguments : useEffect(<function>, <dependency>)..
    useEffect(() => {
        console.log("Groups are refreshed!");
        console.log(userData.data.token);
        const config = {
            headers: {
                authorization : `Bearer ${userData.data.token}`,
            },
        }; // Creates a config object containing an Authorization header with the user's token with start of "Bearer".
        console.log("config : ",config);
        console.log("user useEffect",allGroups);
        const url = searchQuery
        ? `http://localhost:5000/chat/fetchGroups?search=${searchQuery}`
        : "http://localhost:5000/chat/fetchGroups";
        axios.get(url,config).then((data) => { // we send the GET request with specified "config" object..
            console.log("Data refreshed in Groups panel");
            console.log("data",data);
            setGroups(data.data); // we updates the state with the received user data..
        })
        .catch((error) => {
            console.error("Error fetching users:", error);
        });
    },[refresh,searchQuery]); // The [refresh] dependency in the "useEffect" suggests that this effect should run whenever "refresh" variable changed..
    // this refresh is changed when the user clicked on "refresh" button..and every time refresh button got clicked it makes get request and 
    // and every time it checked user authenticated or not and depending on the authentication of user it renders the new user list on UI..
    // also it depend on the "searchQuery" every time when search input is changed then also this "useEffect" is called
    // and again it make request with "new url" with new "searchQuery"..and "fetchAllUserController" again send(res.send) the data 
    // from data base to it's relevant "searchQuery"

  return (
<AnimatePresence> {/*this "AnimatePresence" is for apply transition effect when this whole page("div") loaded */}
    {/*this is main "div" convert into "motion.div" and apply initial,animate,exist and transition effect
           using "framer-motion" framework  */}
    <motion.div 
        initial={{opacity:0,scale:0}} 
        animate={{opacity:1,scale:1}} 
        exist={{opacity:0,scale:0}} 
        transition={{
            ease:"anticipate",
            duration : "0.35",
        }} className={'list-container' + (lightTheme ? "" : " dark")}>
         <div className={'ug-header' + (lightTheme ? "" : " dark")}>
            <img src={chatLogo}  className='user-image'/>
            <p className={'ug-title' + (lightTheme ? "" : " dark")}>Available Groups</p>
            <IconButton onClick={()=>{setRefresh(!refresh)}}>
                <RefreshSharpIcon className={lightTheme ? "" : " dark"}/>
            </IconButton>
        </div>
        <div className={'sb-search' + (lightTheme ? "" : " dark")}>
            <IconButton>
                <SearchIcon className={lightTheme ? "" : " dark"}/>
            </IconButton>
            <input placeholder="Search" value={searchQuery} onChange={handleInputChange} className={'search-box' + (lightTheme ? "" : " dark")}/> {/*this is called "handleInputChange" function */}
        </div>
        <div className={'ug-list'+ (lightTheme ? "" : " dark")}>
        {console.log("Groups : ",allGroups)}
            {allGroups.map((group,index) => {
                // "allGroups" is a state component which is "array"..
                // by making request using axios.get,this req take the "data" of "groups" which is send by the "fetchGroups"("res.send(fullGroupChat)")..and update the state using setGroups(data.data)..
                // in between if we pass searchQuery which is entred by user ..now this new url which has "searchQuery" is make request and take the relevant user data which matches with search query from the 
                // "fetchGroups" and display here..
                // and here we use map function to display "allGroups" array (which is state component)
                return(
                    <motion.div whileHover={{scale:1.019}} whileTap={{scale:0.98}} key={index} className={'list-term'+ (lightTheme ? "" : " dark")}
                        onClick={() => {
                            console.log("Creating chat with group",group.name);
                            const config = {
                                headers:{
                                    authorization : `Bearer ${userData.data.token}`,
                                },
                            };
                            axios.put("http://localhost:5000/chat/addSelfToGroup",
                            {
                                chatId: group._id,// this is come from "allGroups._id"..allGroups map into group in this loop of maping
                                userId:userData.data._id, // this is come from whatever userData stored in localStorage..(// access userId of user on which loged-in user pressed...)
                            },config) // we passing both id as a body with this req to the server side..
                            // when we click the below user name then it make put request and addSelfToGroup function is called on serverSide...

                            .then((response) => {
                                    // Handle the response here
                                console.log("Server response:", response.data);
                            }); 
                            // dispatch(refreshSidebarFun());
                            setRefresh(!refresh); // when user clicked on the any of the group from user list then it change the refresh variable...and 
                            // because of this useEffect function os sideBar.jsx file also got changed...
                            // it trigger all useEffect function which depedent on the "refresh" variable..this is the power of "context varibale" or "context method"...
                        }}
                    >
                    
                    {/*this is convert normal div to motion.div and add whileHover and whileTap effect list item */}
                        <p className={'con-icon'+ (lightTheme ? "" : " dark")}>{group.chatName[0]}</p>
                        <p className={"con-title"+ (lightTheme ? "" : " dark")}>{group.chatName}</p>
                    </motion.div>
                );
            })}
        </div>
    </motion.div>
</AnimatePresence>
  )
}

export default Groups;