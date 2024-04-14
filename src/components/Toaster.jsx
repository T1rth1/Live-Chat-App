import { Alert } from "@mui/material";
import IconButton from "@mui/material";
import Snackbar from "@mui/material";
import React, { useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import { SnackbarProvider, useSnackbar } from 'notistack';

function MyApp() {
    const { enqueueSnackbar } = useSnackbar();
  
    const handleClick = () => {
      enqueueSnackbar('I love snacks.');
    };
  
    const handleClickVariant = (variant) => () => {
      // variant could be success, error, warning, info, or default
      enqueueSnackbar('This is a success message!', { variant });
    };
  
    return (
      <React.Fragment>
        <Button onClick={handleClick}>Show snackbar</Button>
        <Button onClick={handleClickVariant('success')}>Show success snackbar</Button>
      </React.Fragment>
    );
  }
export default function Toaster({message}){
      return(
        <React.Fragment>
            {/* <Button onClick={handleClick}>Show snackbar</Button> */}
            <Button onClick={handleClickVariant('success')}>Show success snackbar</Button>
        </React.Fragment>
      )
}