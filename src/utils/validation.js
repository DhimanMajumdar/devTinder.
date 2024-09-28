 const validator=require("validator");

 const validateSignUpData=(req)=>{
    const {firstName,lastName,emailId,password}=req.body;

    if(!firstName||!lastName) throw new Error("Name is not valid!");
    else if(!validator.isEmail(emailId)) throw new Error("Email is not valid!");
    else if(!validator.isStrongPassword(password)) throw new Error("Please enter a strong password!");
 }

 const validateEditProfile=(req)=>{
   const allowedEditFields=[
      "firstName",
      "lastName",
      "emailId",
      "photoURL",
      "gender",
      "age",
      "about",
      "skills",
   ]
   
   const isEditAllowed=Object.keys(req.body).every(field=>allowedEditFields.includes(field));
   return isEditAllowed;

 }

 module.exports={validateSignUpData,validateEditProfile};