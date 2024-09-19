const express=require("express");

const app=express();


app.get("/user/:userId", (req,res)=>{
    //console.log(req.query);
    console.log(req.params);                                                                                                                                                   
    res.send({firstName:"Dhiman","lastName":"Majumdar"});
})

app.listen(3000,()=>{
    console.log("Server is successfully listening on port 3000...");
    
});