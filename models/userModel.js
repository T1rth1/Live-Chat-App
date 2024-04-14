import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userModel = mongoose.Schema({
    name : {
        type:String,
        required:true,
    },
    email : {
        type:String,
        required:true,
    },
    password : {
        type:String,
        required:true,
    },
});

userModel.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword,this.password);
    // bcrypt.compare is an asynchronous function that compares the entered password with the hashed password which is already in database
};
userModel.pre('save', async function (next) {
    if (!this.isModified('password')) {
      next();
    }
  
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
// A pre-save middleware (userSchema.pre('save', ...)) is added to the schema. 
// This middleware is executed before saving a user document to the database.
// The middleware checks if the password field has been modified. If it hasn't,it skips the hashing process
// and moves on to the next middleware or save operation.
// If the password is modified, it generates a salt using bcrypt.genSalt and hashes the password using bcrypt.hash. 
// The hashed password is then set in the password field of the user document.
// The next() function is called to move on to the next middleware or the save operation.
  });
  
const User = mongoose.model("User",userModel);
// module.exports = User;
export default User;