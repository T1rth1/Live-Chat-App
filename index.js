import  express  from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import userRoutes from "./Routes/userRoutes.js";
import cors from "cors"; 
import chatRoutes from "./Routes/chatRoutes.js";
import messageRoutes from "./Routes/messageRoutes.js";
const app = express();
dotenv.config();

app.use(express.json());
// app.use(cors()); // this is for give permission on port 5000 to make post request from react port 3000...
app.use(cors({ origin: 'http://localhost:3000' }));

const connectDb = async () => {
    try{
        mongoose.connect('mongodb://127.0.0.1:27017/liveChatApp');
        console.log("Server is connected to Db");
    }
    catch(err){
        console.log("Server is not connected to database", err.message);
    }

}
connectDb();

app.use("/user",userRoutes);
app.use("/chat",chatRoutes);
app.use("/message",messageRoutes);
const port = 5000 || process.env.PORT;
const server = app.listen(port,console.log(`Server staterted at port ${port}`));

// import { Server } from "socket.io";

// const io = new Server(server,{
//     cors: {
//         origin: "*",
//     },
//     // pingTimeout: 6000,
// });


// io.on("connection",(socket) => {
//     // console.log("socket.io connection has been established!")
//     socket.on("setup",(user)=>{
//         socket.join(user.data._id);
//         // console.log("server :// joined user : ",user.data._id);
//         socket.emit("connected");
//     });
//     socket.on("join chat",(room) => {
//         socket.join(room);
//         // console.log("User joined room : ", room);
//     });
//     socket.on("new message",(newMessageStatus) => {
//         var chat = newMessageStatus.chat;
//         if(!chat.users){
//             return console.log("chat.users not defined!");
//         }
//         chat.users.forEach((user) => {
//             if(user._id == newMessageStatus.sender._id) return;

//             socket.in(user._id).emit("message recieved",newMessageStatus.newMessage)
//         });
//     });
// });