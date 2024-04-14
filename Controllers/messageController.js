import expressAsyncHandler from "express-async-handler";
import Chat from "../models/chatModel.js";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";

// in client side after in sendMessage message model is created, this function is called to display the message which is create on below "sendMessage" function 

export const allMessages = expressAsyncHandler(async (req,res) => {
    try{
        const messages = await Message.find({chat:req.params.chatId}) // it find the message object in message collection by it's chatId..
        // and populate the sender's name and email and whole chat model ...
        .populate("sender","name email")
        .populate("chat");
        res.json(messages); // send back the response to the client side

    }catch{
        res.status(400);
        throw new Error(error.message);
    }
});

// when in client side user click on the send button then one function is called and in this function
// it made a post request with req.body...this post request handled by this function in server side
export const sendMessage = expressAsyncHandler(async (req,res) => {
 const{content , chatId } = req.body; // it destructure the req.body in this body of request at client side..
 // it passes the content(means which message user typed stored in "content")..and chat
 if(!content || !chatId){ // it anyone bhi not exist then error..
    console.log("Invalid data passed into request");
 }
 var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  }; // create a new object with sender's id,content,and chat's id...

  try {
    var message = await Message.create(newMessage); // create a new model using mongoose create method..

    console.log(message);
    message = await message.populate("sender", "name pic");// populate means replace the sender id with it's corresponding name and email
    message = await message.populate("chat"); // populate means it replace the chatId in this message object with it's corresponding chatModel..
    message = await message.populate("reciever");
         
    message = await User.populate(message, {
      path: "chat.users",
      select: "name email",
    }); // here this populate method is used to go deep down in model..here it goes into the users array of chatModel..
    // and populate all users's name and email which is inside the user array...
    console.log("Naruto message",message);
    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message }); // now we find in Chat model with this chatId and assign
    // the latestMessage of chat model with this message object...
    res.json(message); // send back to the client side
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
export const deleteChat = expressAsyncHandler(async (req,res) => {
  try {
    const { chatid } = req.params;
    // Validate if chatId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(chatid)) {
      return res.status(400).json({ error: 'Invalid chatId' });
    }
   
    const chat = await Chat.findById(chatid);
    console.log("new chat" ,chat);
    // Delete chat records based on chatId
    await Chat.deleteMany({ _id: chatid });
    const deleteResult = await Chat.deleteMany({ _id: chatid });
    res.status(200).json({ message: 'Chat records deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})