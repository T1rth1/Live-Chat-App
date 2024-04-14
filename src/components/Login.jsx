import React from 'react'
import chatLogo from "./4912113.webp"
import { IconButton, InputAdornment, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import { useState } from 'react';
import axios from 'axios';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
// snackbar success and now why axios error come and cant render the welcome page after register ?
function Login() {
  const navigate = useNavigate();
  const [showLogin,setShowLogin] = useState(false);
  const [data,setData] = useState({name:"",email:"",password:""});
  const [loading,setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [logInstatus,setLogInStatus] = useState("");
  const [signUpstatus,setSignUpStatus] = useState("");
  const [open, setOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isFocused1, setIsFocused1] = useState(false);
  const [isFocused2, setIsFocused2] = useState(false);
  const [isFocused3, setIsFocused3] = useState(false);
  const [isFocused4, setIsFocused4] = useState(false);


  const [showPassword, setShowPassword] = useState(false);
  // const handleClose = () => {
  //   setOpen(false);
  // };
  // const handleOpen = () => {
  //   setOpen(true);
  // };
  const onFocusChange = (focused) => {
    setIsFocused(focused);
    // setIsFocused1(focused);
  };
  const onFocusChange1 = (focused) => {
    setIsFocused1(focused);
  };
  const onFocusChange2 = (focused) => {
    setIsFocused2(focused);
  };
  const onFocusChange3 = (focused) => {
    setIsFocused3(focused);
  };
  const onFocusChange4 = (focused) => {
    setIsFocused4(focused);
  };
  const changeHandler = (event) => {
    console.log(event.target.value);
    setData({...data,[event.target.name]: event.target.value}); // it triggers the event when user type anything into inputfield..
    // and it is update the user's new data..by extracting it's value(event.target.value) using "name" attribute which..
    // is given to every "textfield"..
  };
  
  const loginHandler = async (event) => {
    setLoading(true); // loading animation....
    console.log(data);
    try{
      const config = {
        headers: {
          "Content-type" : "application/json",
        },
      };
      const response = await axios.post("http://localhost:5000/user/login",data,config); // to see how axios work see my "API" folder..see no auth,with auth,...etc methods..
      console.log("Login : ", response);
      setLogInStatus({
        msg:"Success",
        key:Math.random(),
      });
      localStorage.setItem("userData",JSON.stringify(response)); //we convert our js object into string..(like we did in angela yu API section..becuz to access the data into .ejs file..)
      // and store this string object into local storage..
      navigate("/app/welcome"); // send user to welcome page..
       // Show success snackbar
       enqueueSnackbar('Login successful!.', {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
        style: { // Customize style, including font size
          fontSize: '17px',
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          padding: '16px',
          borderRadius: '20px',
          display: 'flex',
          boxShadow: 'rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          alignItems: 'center', // Adjust the font size as needed
        },
      });
    }catch(error){
      console.log("hiiiiiiiii!");
      // setLogInStatus({
      //   msg:"Invalid User name or Password",
      //   key:Math.random(),
      // });
      // Show error snackbar
      enqueueSnackbar('Login failed. Invalid credentials.', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
        style: { // Customize style, including font size
          fontSize: '17px',
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          padding: '16px',
          borderRadius: '20px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          boxShadow: 'rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          alignItems: 'center', // Adjust the font size as needed
        },
      });
    }
    setLoading(false);
  };

  const signUpHandler = async (event) => {
    setLoading(true); // loading animation....
    console.log(data);
    try{
      const config = {
        headers: {
          "Content-type" : "application/json",
        },
      };
      const response = await axios.post("http://localhost:5000/user/register",data,config); // to see how axios work see my "API" folder..see no auth,with auth,...etc methods..
      console.log("Register : ", response);
      // setSignUpStatus({
      //   msg:"Success",
      //   key:Math.random(),
      // });
      localStorage.setItem("userData",JSON.stringify(response)); //we convert our js object into string..like we did in angela yu API section..becuz to acess the data into .ejs file..
      navigate("/app/welcome"); // send user to welcome page..after registration
      enqueueSnackbar('SignUp successful!.', {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
        style: { // Customize style, including font size
          fontSize: '17px',
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          padding: '16px',
          borderRadius: '20px',
          display: 'flex',
          boxShadow: 'rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          alignItems: 'center', // Adjust the font size as needed
        },
      });
    }catch(error){
      console.log(error);
      if(error.response && error.response.status === 405){
        // setLogInStatus({
        //   msg: "User with this email ID already Exists",
        //   key: Math.random(),
        // });
        enqueueSnackbar('SignUp failed. Email ID already Exists.', {
          variant: 'error',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
          style: { // Customize style, including font size
            fontSize: '17px',
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '16px',
            borderRadius: '20px',
            display: 'flex',
            boxShadow: 'rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            alignItems: 'center', // Adjust the font size as needed
          },
        });
      }
      if(error.response && error.response.status === 406){
        // setLogInStatus({
        //   msg:"UserName already Taken, Please take unique one",
        //   key:Math.random(),
        // });
        enqueueSnackbar('SignUp failed.UserName Already Taken !!', {
          variant: 'error',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
          style: { // Customize style, including font size
            fontSize: '17px',
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '16px',
            borderRadius: '20px',
            display: 'flex',
            boxShadow: 'rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            alignItems: 'center', // Adjust the font size as needed
          },
        });
      }
      enqueueSnackbar('SignUp failed.', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
        style: { // Customize style, including font size
          fontSize: '17px',
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          padding: '16px',
          borderRadius: '20px',
          display: 'flex',
          boxShadow: 'rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          alignItems: 'center', // Adjust the font size as needed
        },
      });
    }
    setLoading(false);
  };

  return (
    <>
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={loading}
    >
    <CircularProgress color="inherit" />
    </Backdrop>
    <div className='login-container'>
        <div className='image-container'>
            <img src={chatLogo} alt="Logo" className="welcome-logo"/>
        </div>
        {/*here below if showLogin is true then whole code in () this bracket can execute */}
        { showLogin && (
          <div className='login-box'>
            <p className='login-text'>Login to your Account</p>
            <TextField 
              onChange={changeHandler}
              // id="standard-basic" 
              label="Enter Username"
              variant="outlined"
              required
              id="outlined-required standard-basic"
              // style={{width:"23.5%"}}
              name="name" /*this attribute is used to contiuosly update the data using "changeHandler" function */
              InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                       {isFocused && <PersonIcon />}
                    </InputAdornment>
                  ),
              }}
              // onClick={() => } // Toggle showPassword state

              onFocus={() => onFocusChange(true)}
              // onBlur={() => onFocusChange(true)} 
              InputLabelProps={{ shrink: isFocused, }}
              onKeyDown={(event) => {
                if(event.code == "Enter"){
                  loginHandler();
                }
              }}/*this is for when user pressed the Enter key then it called the "loginHandler" function */
            />
            <TextField 
              onChange={changeHandler}
              id="outlined-required outlined-password-input" 
              label="Password" 
              type={showPassword ? "text" : "password"} 
              // style={{width:"23.5%"}}
              required
              variant="outlined" 
              autoComplete='current-password'
              name="password"
              InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        {isFocused1 && <LockIcon />}
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)} // Toggle showPassword state
                        edge="end"
                      >
                        {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              onFocus={() => onFocusChange1(true)}
              InputLabelProps={{ shrink: isFocused1, }}
              onKeyDown={(event) => {
                if(event.code == "Enter"){
                  loginHandler();
                }
              }}
            />
            <Button
             variant="outlined"
             onClick={loginHandler}>Login</Button> {/*on click of button it also called "loginHandler" function */}
             <p>Don't have an Account ?
             <span className='hyper' onClick={()=>{
              setShowLogin(false); {/*when user clicked on "Sign Up" button then we set the our showLogin boolean false..
              now it render the signUp page becuz this condition is become false.. */}
             }}>Sign Up</span>
             </p>
             {/* { logInstatus ? (
              <Toaster key={logInstatus.key} message={logInstatus.msg}/>):null} */}
          </div>
        )}
        {!showLogin && (
          <div className='login-box'>
            <p className='login-text'>Sign up to your Account</p>
            <TextField 
              onChange={changeHandler}
              label="Enter Username" 
              variant="outlined"
              name="name" 
              required
              id="outlined-required standard-basic"

              // style={{width:"25.5%"}}

              /*this attribute is used to contiuosly update the data using "changeHandler" function */
              InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                       {isFocused2 && <PersonIcon />}
                    </InputAdornment>
                  ),
              }}
              // onClick={() => } // Toggle showPassword state

              onFocus={() => onFocusChange2(true)}
              // onBlur={() => onFocusChange(true)} 
              InputLabelProps={{ shrink: isFocused2, }}
              onKeyDown={(event) => {
                if(event.code == "Enter"){
                  signUpHandler();
                }
              }}/*this is for when user pressed the Enter key then it called the "loginHandler" function */
            />
             <TextField 
              onChange={changeHandler}
              type="email"
              label="Enter Email Address" 
              variant="outlined" 
              name="email"   
              required           
              id="outlined-required standard-basic"

              // style={{width:"25.5%"}}

              InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                       {isFocused3 && <EmailIcon />}
                    </InputAdornment>
                  ),
              }}
              // onClick={() => } // Toggle showPassword state

              onFocus={() => onFocusChange3(true)}
              // onBlur={() => onFocusChange(true)} 
              InputLabelProps={{ shrink: isFocused3, }}
              onKeyDown={(event) => {
                if(event.code == "Enter"){
                  signUpHandler();
                }
              }}
              inputProps={{
                pattern: '[a-zA-Z0-9._%+-]+@gmail\\.com',
                title: 'Please enter a valid Gmail address',
              }}
            />
           
            <TextField 
              onChange={changeHandler}
              id="outlined-required outlined-password-input" 
              label="Password" 
              type={showPassword ? "text" : "password"} 
              // style={{width:"25.5%"}}
              variant="outlined" 
              autoComplete='current-password'
              name="password"
              required
              InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        {isFocused4 && <LockIcon />}
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)} // Toggle showPassword state
                        edge="end"
                      >
                        {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              onFocus={() => onFocusChange4(true)}
              InputLabelProps={{ shrink: isFocused4, }}
              onKeyDown={(event) => {
                if(event.code == "Enter"){
                  loginHandler();
                }
              }}
            />
           
            <Button
             variant="outlined"
             onClick={signUpHandler}>Sign Up
             </Button> {/*on click of button it also called "loginHandler" function */}
             <p> Already have an Account ?
             <span 
                className='hyper' 
                onClick={()=>{
                setShowLogin(true); {/*when user clicked on "Sign Up" button then we set the our showLogin boolean false..
                now it render the signUp page becuz this condition is become false.. */}
                }}>Log In
              </span>
             </p>
             {/* { signUpstatus ? ( */}
              {/* <Toaster key={signUpstatus.key} message={signUpstatus.msg}/>):null} */}
          </div>
        )}
        {/* <div className='login-box'>
            <p>Login to your Account</p>
            <TextField id="standard-basic" label="Enter Username" variant="outlined" />
            <TextField id="outlined-password-input" label="Password" type="password" variant="outlined" autoComplete='current-password' />
            <Button variant="outlined">Login</Button>
        </div> */}
    </div>
    </>
  )
}

export default Login;