import mongoose from "mongoose";

const userSchema  = new mongoose.Schema({
    username:{
        type : String,
        required:[true , "Username is reruired"],
        unique : [true , "Username must be unique"]

    },
    email:{
        type : String,
        required:[true , "Email is reruired"],
        unique : [true , "Email must be unique"]
    }
    ,
    password:{
        type : String,
        required:[true , "Password is reruired"]
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    isBlocked: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

const userModel  = mongoose.model("user" , userSchema);
export default userModel;