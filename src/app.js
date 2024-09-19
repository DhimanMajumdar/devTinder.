const express=require("express");
const {adminAuth,userAuth} = require("./middlewares/auth");

const app=express();

// app.use("/route",[rh1,rh2,rh3],rh4);
// GET /users => It checks all the app.xxx("matching route") functions
// GET /users =? middleware chain => request handler 

// Handle Auth Middleware for all GET, POST, ... requests
app.use("/admin",adminAuth); 

app.post("/user/login",(req,res)=>{
    res.send("User logged in successfully!");
})

app.get("/user/data",userAuth,(req,res)=>{
    res.send("User Data Sent");
})

app.get("/admin/getAllData",(req,res)=>{
    // Logic of checking if the request is authorized
    // const token="xyzabc"
    // const isAdminAuthorized=token==="xyz";
    // if(isAdminAuthorized){
    //     res.send("All Data Sent");
    // }
    // else{
    //     res.status(401).send("Unauthorized request");
    // }
    res.send("All Data Sent");
});

app.get("/admin/deleteUser",(req,res)=>{
    // Logic of checking if the request is authorized
    // const token="xyzabc"
    // const isAdminAuthorized=token==="xyz";
    // if(isAdminAuthorized){
    //     res.send("Deleted a user");
    // }
    // else{
    //     res.status(401).send("Unauthorized request");
    // }
    res.send("Deleted a user");
});


app.listen(3000,()=>{
    console.log("Server is successfully listening on port 3000...");
    
});