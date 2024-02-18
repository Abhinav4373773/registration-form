const express=require("express");
const mongoose=require("mongoose");
const  bodyparser=require("body-parser");
const dotenv=require("dotenv");

const app=express();
dotenv.config();

const PORT=process.env.PORT || 3000;
//connection withdb
mongoose.connect(process.env.DATABASE_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
});

//scheema
const registration=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:String,
    password:String
});

const Registrations=mongoose.model("Registrations",registration);

//bodyparser
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.json());

app.get("/",(req,res)=>{
    res.sendFile(__dirname + "/pages/index.html");
})

app.post("/register",async(req,res)=>{
    try {
        const {name,email,password}=req.body;
        // validation
        if(!name || !email || !password)
        {
            // return res.status(500).json({
            //     success:false,
            //     message:"Please fill all the details."
            // });

           return res.redirect("/validationError");
        }

        // check existencen of user
        const exist=await Registrations.findOne({email});

        if(exist)
        {
            // return res.json({
            //     success:false
            // });

            return res.redirect("/existance");
        }

        const registrationData=new Registrations({
            name,
            email,
            password
        });
        await registrationData.save();
 
        res.redirect("/success");
    } catch (error) {
        console.log(error);
        res.redirect("/error")
    }
})




app.get("/success",(req,res)=>{
    res.sendFile(__dirname + "/pages/success.html");
})
app.get("/error",(req,res)=>{
    res.sendFile(__dirname + "/pages/error.html");
})
app.get("/validationError",(req,res)=>{
    res.sendFile(__dirname + "/pages/validationError.html");
})
app.get("/existance",(req,res)=>{
    res.sendFile(__dirname + "/pages/duplicationError.html");
})




app.listen(PORT,()=>{
    console.log(`Server is running at ${PORT}`);
})
