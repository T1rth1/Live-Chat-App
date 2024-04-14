import express from "express";
import {fetchAllUsersController, loginController,registerController} from "../Controllers/userController.js";
import protect from "../middleware/authMiddleware.js";
const Router = express.Router();

Router.post("/login",loginController);
Router.post("/register",registerController);
Router.get("/fetchUsers",protect,fetchAllUsersController);
// fetchallUsercontroller is used for fetch filtered(specific user if search query is given) or fetch all user..and 
// in which user's account this fetching of user is done he/she should be authorized or authenticated
// so we pass protect function..which authorized particular user and after it called fetchallusercontroller 
// function to fetch users..
// this protect function implemented using authmidlleware and users.js file..
// in User.js file we make a request on /user/fethcUsers route with passing authentication headers...and in auth midlleware file
// it take that authorization headers of this HTTPS request which is send on /user/fetchUsers route and authenticate user by it's token...
//********refresh button functionality:
// when the user clicks the refresh button, it triggers a request to the server at http://localhost:5000/user/fetchUsers
// The server route is protected by the protect middleware, ensuring that the user(which click the refresh button) is authenticated.
// If the user is authenticated, the fetchAllUsersController fetches the users from the database
// The fetched user data is sent back as a response to the Users.jsx and in this file it updates it's local state component "setUsers(data.data)",
//  and the UI is updated with the new user list.

// module.exports = Router;
export default Router;
