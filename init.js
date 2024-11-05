const mongoose = require("mongoose");
const Chat = require("./models/chat.js");

main().then(()=>{
    console.log("connection is successful ")
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/fakewhatsapp");
}

let allChats = [{
    from:"praveen",
    to:"rahul",
    msg:"what is your marks",
    created_at:new Date()
},
{
    from:"verma",
    to:"raj",
    msg:"never play ludo",
    created_at:new Date()
}   
]

Chat.insertMany(allChats);