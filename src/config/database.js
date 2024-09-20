const mongoose=require("mongoose");

const connectDB=async()=>{
    await mongoose.connect(
        "mongodb+srv://dhiman:9ZMTMSrx4fUbEGYv@namastenode.besbt.mongodb.net/devTinder"
    );
};
 
module.exports=connectDB;