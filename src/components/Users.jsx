import React, { useContext, useEffect, useState } from 'react'
import chatLogo from "./live-chat_512px.png"
import { IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshSharpIcon from '@mui/icons-material/RefreshSharp';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useDispatch, useSelector } from 'react-redux';
import {motion} from "framer-motion";
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { refreshSidebarFun } from '../Features/refreshSidebar';
import { myContext } from "./MainContainer";

import axios from 'axios';
function Users() {
    const {refresh , setRefresh} = useContext(myContext); // here i use refresh variable as a context..
    // using context only by decalring the state variable only one time in mainContainer.jsx file
    // we can use this refresh variable in all files...
    // means if in this file refresh variable is changed then where where this variable is used in all files that also gonna change...
    // this is a big advantage of contextApi...
    const lightTheme = useSelector((state) => state.themeKey); // now we can use this state variable "lightTheme" everywhere..
    // dispatch function is used only on button which is responsible to toggle theme.. 
    const [allUsers , setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const userData = JSON.parse(localStorage.getItem("userData")); // This line retrieves the "userData" from the localStorage and parses it as JSON. 
    // which was previously stored as a JSON string.
    const navigate = useNavigate();
    // if(!userData){
    //     console.log("User not Authenticated");
    //     navi("/"); //  uses nav(-1) to navigate back in the browser history.
    // }
    const handleInputChange = (event) => {
        // here i take the searchQuery..by targetting input field "value"..and update "searchQuery" state component..
        setSearchQuery(event.target.value);
        console.log(event.target.value);
    };
    // useEffect accepts two arguments : useEffect(<function>, <dependency>)..
    useEffect(() => {
        if(!userData || !userData.data){
            console.log("User not Authenticated");
            navigate("/");
            return;
          }
        console.log("Users refreshed!");
        console.log(userData.data.token);
        const config = {
            headers: {
                authorization : `Bearer ${userData.data.token}`,
            },
        }; // Creates a config object containing an Authorization header with the user's token with start of "Bearer".
        console.log("config : ",config);
        console.log("user useEffect",allUsers);
        const url = searchQuery
        ? `http://localhost:5000/user/fetchUsers?search=${searchQuery}`
        : "http://localhost:5000/user/fetchUsers";
        axios.get(url,config).then((data) => { // we send the GET request with specified "config" object..
            console.log("Data refreshed in Users panel");
            console.log("data",data);
            setUsers(data.data); // we updates the state with the received user data..
        })
        .catch((error) => {
            console.error("Error fetching users:", error);
        });
    },[refresh,searchQuery,allUsers]); // The [refresh] dependency in the "useEffect" suggests that this effect should run whenever "refresh" variable changed..
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
            <p className={'ug-title' + (lightTheme ? "" : " dark")}>Online Users</p>
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
        {console.log("Users : ",allUsers)}
            {allUsers.map((user,index) => {
                // "allUsers" is a state component which is "array"..
                // by making request using axios.get,this req take the "data" of "users" which is send by the "fetchAllUserController"("res.send(users)")..and update the state using setUsers(data.data)..
                // in between if we pass searchQuery which is entred by user ..now this new url which has "searchQuery" is make request and take the relevant user data which matches with searchQuery from the 
                // "fetchAllUseController" and display here..
                // and here we use map function to display "allUsers" array (which is state component)
                return(
                    <motion.div whileHover={{scale:1.019}} whileTap={{scale:0.98}} key={index} className={'list-term'+ (lightTheme ? "" : " dark")}
                        onClick={() => {
                            console.log("Creating chat with ",user.name);
                            const config = {
                                headers:{
                                    authorization : `Bearer ${userData.data.token}`,
                                },
                            };
                            axios.post("http://localhost:5000/chat/",{oppUserId: user._id,},config)// access userId of user on which loged-in user pressed...
                            // when we click the below user name then it make post request and accessChat function is called..and new chat created if not exist..
                            .then((response) => {
                                    // Handle the response here
                                console.log("Server response:", response.data);
                            }); 
                            // dispatch(refreshSidebarFun());
                            setRefresh(!refresh); // when loged-in user clicked on any user from this userList then it toggle(change) the refresh variable..
                            // and we have useEffect function which is depedent on the refresh variable in sidebar.jsx file..
                            // and this useEffect is responsible to render the chats with other users...
                            // so this refresh variable changed from here because it is context variable(refresh) so it also change in sideBar.jsx file..
                            // and it call the useEffect function and re-render the chats on sidebar...
                        }}
                    >
                    
                    {/*this is convert normal div to motion.div and add whileHover and whileTap effect list item */}
                        <p className={'con-icon'+ (lightTheme ? "" : " dark")}>{user.name[0]}</p>
                        <p className={"con-title"+ (lightTheme ? "" : " dark")}>{user.name}</p>
                    </motion.div>
                );
            })}
        </div>
    </motion.div>
</AnimatePresence>
  )
}

export default Users;