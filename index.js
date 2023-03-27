const express=require("express")
const { connection } = require("./config/db")
const{userRouter}=require("./routes/User.routes")
const winston=require("winston")
const expressWinston=require("express-winston")
const app=express()
require("dotenv").config()


app.use(express.json())
app.use("/users",userRouter)

app.get("/",(req,res)=>{
    res.send("Welcome to Weather App")
})

app.use(expressWinston.logger({
    statusLevels:true,
    transports:[
        new winston.transports.Console({
            level:"info",
            json:true
        }),
        new winston.transports.File({
            level:"info",
            json:true,
            filename:"data.log"
        })
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    ) 
}));


app.listen(process.env.PORT,async()=>{
    try {
        await connection
        console.log("Connected to DB")
    } catch (err) {
        console.log("Trouble connecting to DB")
        console.log(err)
        
    }
    console.log("Running to the port 9090")
})