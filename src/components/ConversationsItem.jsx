import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
function ConversationsItem(props) {
    const navigate = useNavigate();
    const lightTheme = useSelector((state) => state.themeKey);
  return (
    <div className={'conversation-container'+ (lightTheme ? "" : " dark")} onClick={()=>{navigate('chat');}}
    >
        <p className='con-icon'>{props.name[0]}</p> {/*take first letter to make it's icon*/}
        <p className={'con-title'+ (lightTheme ? "" : " dark")}>{props.name}</p>
        <p className={'con-lastMessage'+ (lightTheme ? "" : " dark")}>{props.lastMessage}</p>
        <p className={'con-timeStamp'+ (lightTheme ? "" : " dark")}>{props.timeStamp}</p>
    </div>
  )
}

export default ConversationsItem