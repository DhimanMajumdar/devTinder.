const express=require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter=express.Router();

const USER_SAVE_DATA="firstName lastName photoUrl age gender aboutskills";
// get all the pending connection request for the loggedIn user
userRouter.get("/user/requests/received", userAuth ,async (req,res)=>{
    try{
        const loggedInUser=req.user;
        const connectionRequests=await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status:"interested",
        }).populate("fromUserId",["firstName","lastName","photoUrl","age","gender","about","skills"]);
        res.json({
            message:"Data Fetched Successfully!!",
            data:connectionRequests,
        })
    } catch(err){
        res.status(400).send("ERROR :" + err.message);
    }
} )

userRouter.get("/user/connections", userAuth, async(req,res)=>{
    try{
        const loggedInUser=req.user;
        const connectionRequests=await ConnectionRequest.find({
            $or:[
                {toUserId:loggedInUser._id,status:"accepted"},
                {fromUserId:loggedInUser._id,status:"accepted"},
            ]
        }).populate("fromUserId",USER_SAVE_DATA).populate("toUserId",USER_SAVE_DATA);
        const data=connectionRequests.map(row=>{
            if(row.fromUserId._id.toString()===loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        });
        res.json({data});
    } catch(err){
        res.status(400).send("ERROR :" + err.message);
    }
})

module.exports=userRouter;