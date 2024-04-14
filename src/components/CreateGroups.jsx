import { IconButton } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {motion} from "framer-motion";
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material';
import { useState } from 'react';
import axios from 'axios'; 
function CreateGroups() {
    const lightTheme = useSelector((state) => state.themeKey);
    const userData = JSON.parse(localStorage.getItem("userData"));
    const navigate = useNavigate();
    if(!userData){
      console.log("User not Authenticated");
      navigate("/");
    }
    const user = userData.data;
    const [groupName,setGroupName] = useState("");
    const [open,setOpen] = useState(false); 
    const handleClose = () =>{
      setOpen(false);
    };
    const handleClickOpen = () =>{
      console.log("Button is clicked on creatGroup file")
      setOpen(true);
    };
    console.log("User data in CreateGroups file : ", userData);
    const createGroup = () => {
      console.log("Naruto from CreateGroup file");
      const config = {
        headers:{
          authorization:`Bearer ${user.token}`,
        },
      };
      axios.post("http://localhost:5000/chat/createGroup", // making post request on the particular route..
      {
        name:groupName,// this is state value which is taken(updated) from input field..
        users:'[]' // remain should provide dynamic id..
      },config
      ).then(response => {
        console.log("Response from server:", response);
        navigate("/app/groups"); // Navigate after successful post request
      })
      .catch(error => {
        console.error("Error creating group:", error.response.data);
        // Handle the error appropriately
      });
      navigate("/app/groups"); // and navigate to new page
    }
  return (
    // when user clicked on the "CheckCircleIcon" then it trigger the "handleClickOpen" function which set "open" state to true..
    // then dialogue box opened and if user click on the agree but then it trigger the "handleClose" and "createGroup" function..
    // "handleClose" function set "open" state to false..dialogue box closed and createGroup function also triggered so it make post request 
    // with just passing group name and users array as a body...
    <AnimatePresence>
    <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Do you want to create a Group Named #" + groupName}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
              This will create a group in which you will be the admin and
              other will be able to join this group.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <IconButton onClick={handleClose} >  Disagree
          </IconButton>
          <IconButton onClick={() => {createGroup();handleClose();}} autoFocus >
            Agree
          </IconButton>
        </DialogActions>
      </Dialog>
    <motion.div 
        initial={{opacity:0,scale:0}} 
        animate={{opacity:1,scale:1}} 
        exist={{opacity:0,scale:0}} 
        transition={{
            ease:"anticipate",
            duration : "0.35",
        }} className={'createGroups-container'+ (lightTheme ? "" : " dark")}>
        <input placeholder='Enter Group Name' className={'search-box'+ (lightTheme ? "" : " dark")}
         onChange={(event)=>{setGroupName(event.target.value);}}
         onKeyDown={(event) => {
                  if (event.code == "Enter") {
                    // console.log(event);
                    handleClickOpen();
                  }
                  // this is for when user click on the "Enter" button..then it trigger handleClickOpen() function..
                }}
         /> 
        {/*here in this input field what ever name is given to the group is adapted using event.target.value
        and uodate the state  "setGroupName"*/}
        <IconButton onClick={()=>{handleClickOpen();}}>
            <CheckCircleIcon className={(lightTheme ? "" : " dark")}/>
        </IconButton>
    </motion.div>
    </AnimatePresence>
  )
}

export default CreateGroups;