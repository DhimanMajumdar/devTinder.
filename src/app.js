const express=require("express");

const app=express();

// app.use("/route",[rh1,rh2,rh3],rh4);

app.use(
    "/user",
    (req,res,next)=>{
        console.log("Handling the route user!!");
        next();
        //res.send("Response!!");
    },
    (req,res,next)=>{
        console.log("Handling the route user 2!!");
        res.send("2nd response!!");
         
    }
);

app.listen(3000,()=>{
    console.log("Server is successfully listening on port 3000...");
    
});