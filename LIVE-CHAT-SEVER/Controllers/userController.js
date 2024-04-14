import UserModel from "../models/userModel.js"
import expressAsyncHandler from "express-async-handler";
import generateToken from "../Config/generateToken.js";


export const loginController = expressAsyncHandler(async (req,res) => {
    const {name,password} = req.body;
    const user = await UserModel.findOne({name});

    if(user && (await user.matchPassword(password))){
        res.json({
            _id:user._id,
            name:user.name,
            email:user.email,
            isAdmin:user.isAdmin,
            token:generateToken(user._id),
        })
    }else{
        throw new Error("Invalid Username or Password");
    }
});
export const registerController = expressAsyncHandler ( async (req,res) => {
    const {name,email,password} = req.body;
    //check for all fields..
    if(!name || !email || !password){
        res.send(400);
        throw Error("All necessary input field have not been filled")
    }

    //pre-existing user
    const userExist = await UserModel.findOne({email});
    if(userExist){
        throw new Error("User already Exists");
    }

    //userName already Taken
    const userNameExist = await UserModel.findOne({name});
    if(userNameExist){
        throw new Error("Username already Taken");
    }

    //create an entry in DB
    const user = await UserModel.create({name,email,password});
    if(user){
        res.status(201).json({
            _id:user.id,
            name:user.name,
            email:user.email,
            isAdmin:user.isAdmin,
            token:generateToken(user._id),
        })
    }else{
        res.status(400);
        throw new Error("Registration Error")
    }
});
export const fetchAllUsersController = expressAsyncHandler(async (req,res) => {
    // http://localhost:8080/user/fetchUsers?search=John...this search query extracted using "req.query.search"
    // req.query.search = "john"..for this case..
    console.log("search query",req.query.search);
    const keyword = req.query.search ?
    {
        // The $or operator performs a logical OR operation on an array of one or more <expressions> and selects the documents that satisfy at least one of the <expressions>.        
        // see documentation of mongoDB on $or operation...
        $or : [
            {name: {$regex: req.query.search, $options:"i"}},
            {email: {$regex: req.query.search, $options:"i"}},
        ],
    } : {};
    // if search query is provided then we assign this $or object to "keyword"..o/w emty("{}") object we provide to "keyword" constant
    // $regex is a MongoDB operator for regular expression matching...
    
    // if the search query is provided then This keyword object is then passed to UserModel.find(keyword), 
    // and it will search for "documents" in the "UserModel collection" where either the 'name' field matches the provided search query case-insensitively
    //  or 'email' field matches the provided search query case-insensitive with search query.
    //  further filters out  by excluding documents where the '_id' is not equal to the '_id' of the current user ($ne means not equal).
    // and if the search query is not provided then keyword={} then 
    // As a result, the UserModel.find(keyword) fetches all users without any specific search conditions (other than excluding the current user).
    //  So, the absence of the search parameter triggers the default behavior to fetch all users.
    const users = await UserModel.find(keyword).find({
        _id : {$ne : req.user._id}, // "$ne => notequalto"
    });
    console.log("keyword",keyword);
    console.log("server side user",users);
    res.send(users); // send back the array of users..which meet search query critaria..
});

  