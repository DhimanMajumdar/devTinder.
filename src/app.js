const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
  // Creating a new instance of the User Model
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Error saving the user:" + err.message);
  }
});

// Get user by email
app.get("/user",async (req,res)=>{
  const userEmail=req.body.emailId;

  try{
    const users=await User.findOne({emailId:userEmail});
    res.send(users);

    // const users=await User.find({emailId:userEmail});
    // if(users.length===0) res.status(404).send("User not found");
    // else res.send(users);
  }
  catch{
    res.status(400).send("Something went wrong!!");
  }
})

// Delete API - Delete an user from a database
app.delete("/user", async (req,res)=>{
  const userId=req.body.userId; 
  try{
    const users=await User.findByIdAndDelete(userId);
    res.send(users);
  }
  catch{
    res.status(400).send("id not found");
  }
})

// Update data of the user
app.patch("/user/:userId",async (req,res)=>{
  const userId=req.params?.userId;
  const data=req.body;
 
  try{
    const ALLOWED_UPDATES=["photUrl","about","gender","age","skills"];
    const isUpdateAllowed=Object.keys(data).every((k)=>
      ALLOWED_UPDATES.includes(k)
    );
    if(!isUpdateAllowed){
      throw new Error("Update not allowed");
    }
    if(data?.skills.length>10){
      throw new Error("Skills can not be more than 10");
    }
    const user=await User.findByIdAndUpdate({_id:userId},data,{
      returnDocument:"after",
      runValidators:true,
    });
    console.log(user);
    res.send("User Updated successfully");
  }
  catch(err){
    res.status(400).send("UPDATE FAILED:"+err.message);
  }
})


// Feed API - GET /feed - get all the users from the database
app.get("/feed",async (req,res)=>{
  try{
    const users=await User.find({});
    res.send(users);
  } catch(err){
    res.status(400).send("Something went wrong!!");
  }
});

connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(3000, () => {
      console.log("Server is successfully listening on port 3000...");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!");
  });
