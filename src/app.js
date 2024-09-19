const express=require("express");

const app=express();

// // order matters
// app.use("/user",(req,res)=>{
//     res.send("HAHAHAHA");
// })

// this will only handle GET call to /user
app.get("/user", (req,res)=>{
    res.send({firstName:"Dhiman","lastName":"Majumdar"});
})

app.post("/user", (req,res)=>{
    // Saving data  to DB
    res.send("Data successfully saved to the database!");
})

app.delete("/user", (req,res)=>{
    res.send("Deleted data successfully!");
})

// this will match all the HTTP method API calls to /test
app.use("/test",(req,res)=>{
    res.send("Hello from the server");
})



app.listen(3000,()=>{
    console.log("Server is successfully listening on port 3000...");
    
});