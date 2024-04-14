import asyncHandler from "express-async-handler";
import Chat from "../models/chatModel.js";
import User from "../models/userModel.js";

export const accessChat = asyncHandler(async (req,res) => {
    // this function is used to check if between this two user already chat exist using "isChat" array..if yes then do nothing
    //  and no chat exist then create a new chat in the database..after to display this created chat we use "displayChat" function to do so
    // this function triggered when in user.jsx file 
    // user clicked on the any user from userList of onlineuser page then post request made..
    const { oppUserId } = req.body;// that request made by passing "oppuserId"..which is userId of user from userList..
    if(!oppUserId){
        console.log("UserId param not sent with request");
        return res.sendStatus(400);
    }
    console.log("accessChat");
    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            {users: {$elemMatch: {$eq: req.user._id}}},
            {users: {$elemMatch: {$eq: oppUserId}}},
        ]
    }).populate("users","-password")
      .populate("latestMessage");
      // it ensures that chat is not groupChat and both condition inside the $and array must be satisfied..
      // means it checks in the users array..in this users array there must be two user object if chat is created earlier..
      // one of the loged-in user and another is user with whome loged-in user has one-to-one chat..
      // so it find the chatObject which has these two user's id..
      // and if chat is found out with this specific condtion then..
      // it populate "users" except "password" means..
      // populate is a mongoose method..
      // mongoose automatically recognizes that the users field in the Chat schema is referring to the User model...
      // from that model... update the users array with the corresponding user documents according to user's id, excluding the "password" field. 
    //   This means that the users array  now contain user details (e.g., "name" and "email")..and assign to the "isChat" array..

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select:"name email",
    });
    // also to do deep branching in populate..we use User.populate method..
    // here it goes in latestMessage's sender field( which is message schema's sender field becuz latest message referenced with messageSchema..)
    // and this sender field referenced with "userModel" so now it update the latestMessage's sender field 
    // with user's name and email field also from user schema..
    if(isChat.length!=0){
        res.send(isChat[0]);
        // this response send back to the client-side(frontend)...but this response is not used in client side to do any operation..
        // now isChat array has always one element(one JS object)...which contain one to one chat details of two users...
    }else{
        // if loged-in user clicked on the another user and have not chat with him/her..
        // then create a new chat between both user..
        //....we create a chatData according to chatModel...
        // in users array we pass only both user's id..
        const otherUser = await User.findById(oppUserId); // here i find the opposite user with whom loged-in user create chat..
        var chatData = {
            chatName: otherUser.name,// and assign this otheUser name to the chatName variable...which i later on use in search functionality
            isGroupChat: false,
            users: [req.user._id, oppUserId],
          };
          // so in database of "chats" and in this "users" array only id of both user gone...see chat data collection...
          try {
            const createdChat = await Chat.create(chatData); // create a "chat" object into database
            const FullChat = await Chat.findOne({ _id: createdChat._id })
            .populate(
              "users",
              "-password"
            );
            // now we find created chat by it's id and using populate method...in users array..
            // we replace this both user's "id" with it corresponding "userSchema" which contain "name","email","password" using populate method except password field..
            // now fullChat has a chatname:,isGroupChat:,users:(array with "name" and "email" field),
            // and send back to client side(frontend)..but not used this response..
            res.status(200).json(FullChat);
          } catch (error) {
            res.status(400);
            throw new Error(error.message);
          }
    }
});
// now creation of chat is done when loged-in user click on any user int the onlinUser page...
// now to display chats with that particular user on the sideBar..for that this below function is used..
export const displayChats = asyncHandler(async (req, res) => {
    // in sideBar.jsx file when refresh variable changed the useEffect function called and it make get request
    // to fetch(display) chats over the sideBar container...this chat is created using accessChat function..
    //so this function populate some fields in that created chat and in last send back to the sideBar.jsx file..
    // in this file we display the the person name or latest message with whome loged-in user created chat..
    console.log("displayChat");
    try {
      const keyword = req.query.search
      ? {
          $or: [
            { chatName: { $regex: req.query.search, $options: 'i' } },
          ],
        }
      : {};
      const chatQuery = {
        users: { $elemMatch: { $eq: req.user._id } },
        ...keyword,
      };
    //   It retrieves chats where the users array contains the loged-in user's ID (req.user._id).
    //  The $elemMatch operator is used to match documents where at least one element in the users array is equal to the user's ID.
    // with this we pass keyword as a spread operator so in detailed search done..it searches through chat with current loged-in user has chat and also
    // it filter out this all chats based on searchQuery...means it display those chats which has name equal to in the searchQuery and also this chats must be 
    // initiated with this loged-in user....
      const results = await Chat.find(chatQuery)
      .populate('users', '-password') // Populates the users field in the retrieved chat documents, excluding the password field.
      .populate('groupAdmin', '-password') // Populates the groupAdmin field in the retrieved chat documents, excluding the password field.
      .populate('latestMessage')
      .sort({ updatedAt: -1 });//Sorts the retrieved chat documents based on the updatedAt field in descending order, placing the most recently updated chats first.
      const populatedResults = await User.populate(results, {
        path: 'latestMessage.sender',
        select: 'name email',
      });
      console.log("Fetch Chats aPI : ", req);

          res.status(200).send(populatedResults); // this response send back to the sidebar.jsx file..here new one-to-one chat created so latest message is not there..
          // so we handle this condition in frontend accordingly
        // });
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  });

// when user send a post request on /chat/createGroup route then this post request handled by this function..
// this function is used to create a new groupchat if it is not exist..
export const createGroupChat = asyncHandler(async (req, res) => {
  console.log("Naruto : ",req);
  
    if (!req.body.users || !req.body.name) {
      return res.status(400).send({ message: "Data is insufficient" });
    }
    // it checks if user and name field is present in the incoming post request..if not then give error..
    // in post request as a body it passe the name and users array which contain participants id's in that particular groups...
  var users = JSON.parse(req.body.users); // take the users array..
  console.log("chatController/createGroups : ", req);
  users.push(req.user); // it pushes the current loged-in user in that users array..so in starting only one participant is there in the group and that is
  //  loged-in user

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    }); // create a groupChat object with users array,groupAdmin set to true and groupAdmin make to loged-in user which create a group..
    // so that's why in database only this object saved..

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    // in users array..all users's name and email field populate except password...same for groupAdmin name and email field populate 
    // from userModel recognize by the populate method..
    res.status(200).json(fullGroupChat); // sent a response back to the "CreatGroups.jsx"..in this
    // file we haven't use this response anywhere...
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// export const fetchGroups = asyncHandler(async (req, res) => {
//     try {
//       const allGroups = await Chat.where("isGroupChat").equals(true);
//       // It check the database of Chat model to find all documents(which is prviously created by the createGroupChat function) where the isGroupChat field is equal to true. 
//       res.status(200).send(allGroups); // and if find then send back the all found Groups which has isGroupChat=true to groups.jsx file from where "get" request is being made on this particular route
//       // "/chat/fetchGroups" and this function triggered..and we use this response at client side to do some additional operation..

//       // this allGroups object(which is send over to the groups.jsx file) hasn't "name" and "email" field of users array..because in createGroup function, it saved document without this "name" and "email" field of users..
//     } catch (error) {
//       res.status(400);
//       throw new Error(error.message);
//     }
//   });

// this function is used to display only awailable groups(created groups)..and display over the page only..
  export const fetchGroups = asyncHandler(async (req, res) => {
    try {
      const keyword = req.query.search
        ? {
            $or: [
              { chatName: { $regex: req.query.search, $options: "i" } },
            ],
          }
        : {};
  
      const allGroups = await Chat.find({ ...keyword, isGroupChat: true });
      // "...keyword" spread operator is used to merge the keyword object with the condition { isGroupChat: true }..
      // It check the database of Chat model to find all documents(which is prviously created by the createGroupChat function) which has satifies the "keyword's"($or condition) condition and also isGroupChat=true condition also...
      res.status(200).send(allGroups);// and if find then send back the all found Groups which has isGroupChat=true to groups.jsx file from where "get" request is being made on this particular route
      // "/chat/fetchGroups" and this function triggered..and we use this response at client side to do some additional operation..
      
      // this allGroups object(which is send over to the groups.jsx file) hasn't "name" and "email" field of users array..because in createGroup function, it saved document without this "name" and "email" field of users..
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  });
  
export const groupExit = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body; 
  
    // check if the requester is admin
    // console.log("groupExit",req.body);
    console.log("groupExit route hit");
    // const { chatId, userId } = req.body;
    console.log("Received chatId:", chatId, "userId:", userId);
    const removed = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
  
    if (!removed) {
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      res.json(removed);
    }
  });

export const addSelfToGroup = asyncHandler(async (req,res) => {
    const { chatId, userId } = req.body; // it destructuring the chatId and userId from req.body
    // find the Chat using it's chatId and push the user with loged-in user id who try to add it's self to the group by clicking over the any group..
    const added = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push: {users: userId},
        },
        {
            new:true, //This option ensures that the method returns the modified document rather than the original.
        }
    ).populate("users","-password")
     .populate("groupAdmin","-password");
     // this populate method replace the userId in users array by it's corresponding  user documents from the User collection.
     // same for groupAdmin..
     if(!added){
        res.status(404);
        throw new Error("Chat Not Found");
     }else{
        res.json(added); // if added is found send back to client side(to Groups.jsx file)
     }
});

// populate method overview...check users array and groupAdmin field

// Before "populate" : 
// {
//   "_id": "someChatId",
//   "users": ["userId1", "userId2"],
//   "groupAdmin": "adminUserId"
// }

// After "populate" :
// {
//   "_id": "someChatId",
//   "users": [
//     {
//       "_id": "userId1",
//       "name": "User1",
//       // Other user fields excluding the password
//     },
//     {
//       "_id": "userId2",
//       "name": "User2",
//       // Other user fields excluding the password
//     }
//   ],
//   "groupAdmin": {
//     "_id": "adminUserId",
//     "name": "AdminUser",
//     // Other admin user fields excluding the password
//   }
// }

