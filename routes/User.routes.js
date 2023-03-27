const express=require("express")
const{UserModel}=require("../models/User.model")
const{authenticate}=require("../middlewares/Authenticate.middleware")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
const userRouter=express.Router()

require("dotenv").config()

userRouter.post("/signup",async(req,res)=>{
    try {
        const{email,password}=req.body
        bcrypt.hash(password,5,async function(err, hash) {
            // Store hash in your password DB.
            const user = new UserModel({
                email:email,
                password:password
            })
            await user.save()
            res.send({"msg":"User has been registered"})
            console.log(user)
        });
    } catch (error) {
        console.log(error)
        
    }
})

userRouter.post("/login",async(req,res)=>{
    const{email,password}=req.body;
    const user=await UserModel.findOne({email})
    if(!user){
        res.status(404).send("Please signup first")
        return    
    }
    const hashedpassword=user?.password
    bcrypt.compare(password, hashedpassword, function(err, result) {
        if(result){
            
            const token=jwt.sign({userID:user._id}, process.env.JWT_SECRET,{expiresIn:"1h"})
            res.send({msg:"login successfull",token,user})
        
        }else{
            res.status(400).send("login unsuccessfull")
        }
        
    });
})

userRouter.get("/logout",(req,res)=>{
    const token=req.headers.authorization
    try {
        client.LPUSH("black",token)
        // const blacklistdata=JSON.parse(fs.readFileSync("./blacklist.json","utf-8"))
        // blacklistdata.push(token)
        // fs.writeFileSync("./blacklist.json",JSON.stringify(blacklistdata))
        res.send({"msg":"logged out successfully"})
    } catch (err) {
        console.log(err)
    }
})

userRouter.get("/WeatherDetail/:query",async(req,res)=>{
    const query=req.params.query
    try {
        const response = await fetch(`http://api.weatherstack.com/current?access_key=691c00cf022ee2fdf98451a1b539a237&query=${query}`)
        const body = await response.json()
        res.send(body)
    } catch (error) {
        console.log(error.message)
    }

})

userRouter.get("/Weather",authenticate,(req,res)=>{
    res.send("Data..")
})

module.exports={
    userRouter
}