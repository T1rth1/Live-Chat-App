import React from 'react'
import { useSelector } from 'react-redux'
import "./css/mainContainer.css";
function MessageOther(props) {
    const props1 = {
        name:"RandomUser",
        message:"This is a Sample Message"
    }
    const lightTheme = useSelector((state) => state.themeKey);
    return (
        <div className={"other-message-container" + (lightTheme ? "" : " dark")}>
          <div className={"conversation-container" + (lightTheme ? "" : " dark")}>
            <p className={"con-icon" + (lightTheme ? "" : " dark")}>
              {props.messageOther.sender.name[0]}
            </p>
            <div className={"other-text-content" + (lightTheme ? "" : " dark")}>
              <p className={"con-title" + (lightTheme ? "" : " dark")}>
                {props.messageOther.sender.name}
              </p>
              <p className={"con-lastMessage" + (lightTheme ? "" : " dark")}>
                {props.messageOther.content}
              </p>
              {/* <p className="self-timeStamp">12:00am</p> */}
            </div>
          </div>
        </div>
      );
}

export default MessageOther