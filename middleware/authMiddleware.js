import jwt  from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler"

const protect = asyncHandler(async (req,res,next) => {
    let userToken;
    console.log("auth middleware : ",req.headers.authorization.startsWith("Bearer"));
    console.log("auth middleware : ",req.headers.authorization);

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer") ){
        // it take token from the req.headers.Authorization from request being made on /user/fetchuser and verify it...
        try{
            userToken = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(userToken,process.env.JWT_SECRET); // verify token with inbuilt verify function of "jwt"...
            console.log("Decoded : ",decoded);
            req.user = await User.findById(decoded.id).select("-password");
            console.log("user : ", req.user);
            next(); // this next() function called fecthAllUserController middleware to send the awailable user to frontend..
        }catch(error){
            res.status(401);
            throw new Error("Try again : Not authorized, token failed to verify");
        }
    }
    if(!userToken){
    console.log("Entered protect middleware");

        res.status(401);
        throw new Error("Not authorized, no token");
    }
});

export default protect;