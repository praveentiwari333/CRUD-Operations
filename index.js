const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js");
const methodOverride = require("method-override");
const ExpressError = require("./ExpressError");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

main().then(()=>{
    console.log("connection is successful ")
})
.catch((err)=>{
    console.log(err);
})

// let chat1 = new Chat({
//     from:"neha",
//     to:"priya",
//     msg:"send me your exam sheets",
//     created_at:new Date()
// })

// chat1.save().then((res)=>{console.log(res)})
// .catch((err)=>{console.log(err)});

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/fakewhatsapp");
}

app.get("/chats",async(req,res,next)=>{
   try{
    let chats = await Chat.find();
    console.log(chats);
    res.render("index.ejs",{chats});
   } catch(err){
    next(err);
   }
})

app.get("/chats/new",(req,res)=>{
    //throw new ExpressError(404,"Chat not found");
    res.render("new.ejs");
})

app.post("/chats",(req,res)=>{
    let {from,to,msg} = req.body;
    let newChat = new Chat({
        from:from,
        to:to,
        msg:msg,
        created_at:new Date()
    })
    newChat.save().then((res)=>console.log("chat was saved")).catch((err)=>{console.log(err)})
    res.redirect("/chats");
})

function asyncWrap(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err)=>next(err));
    }
}

//Error Handling Path for asyncronous..
app.get("/chats/:id",asyncWrap(async (req,res,next)=>{ //asyncWrap function is used and try and catch is avoided.
        let {id} = req.params;
        let chat = await Chat.findById(id);
        if(!chat){  //chat not found
            next(new ExpressError(404,"Chat not found"));
        }
        res.render("edit.ejs",{chat});
}))


app.get("/chats/:id/edit",async (req,res,next)=>{
    try{
    let {id} = req.params;
    let chat = await Chat.findById(id);
    res.render("edit.ejs",{chat});
    }catch(err){
        next(err);
    }
})

app.put("/chats/:id",async (req,res,next)=>{
    try{
        let {id} = req.params;
        let {msg:newMsg} = req.body;
        let updatedChat = await Chat.findByIdAndUpdate(id,{msg:newMsg},{runValidators:true,new:true});
        res.redirect("/chats");
    }catch(err){
        next(err);
    }
})

app.delete("/chats/:id",async (req,res,next)=>{
    try{
        let {id} = req.params;
        let deletedChat = await Chat.findByIdAndDelete(id);
        res.redirect("/chats");
    }catch(err){
        next(err);
    }
})

app.get("/",(req,res)=>{
    res.send("root is working");
})

//Error Handling Middlewares
app.use((err,req,res,next)=>{
    let {status=500,message="Some error occured"} = err;
    res.status(status).send(message);
})

app.listen(8080,()=>{
    console.log("server is listening on port 8080");
})