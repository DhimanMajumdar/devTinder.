const express=require("express");


const app=express();

// app.use("/route",[rh1,rh2,rh3],rh4);
// GET /users => It checks all the app.xxx("matching route") functions
// GET /users =? middleware chain => request handler 

app.get("/getUserData",(req,res)=>{
    // Logic of DB call and get user data
    try{
        throw new Error("dvbzhij");
        res.send("User Data Sent");
    }
    catch{
        res.status(500).send("something went wrong in catch block!!");
    }
    
});

app.use("/",(err,req,res,next)=>{
    if(err){
        // Log your error
        
    }
});

app.listen(3000,()=>{
    console.log("Server is successfully listening on port 3000...");
    
});