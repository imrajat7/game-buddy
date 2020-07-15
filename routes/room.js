const express=require("express");
const bosyParser=require("body-parser");
const mongoose=require("mongoose");
const bodyParser = require("body-parser");


const app=express();

app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/roomDB", { useNewUrlParser: true ,  useUnifiedTopology: true});

const roomSchema=new mongoose.Schema({
    roomName:{
        type:String,
        default:"qwertyuiop"
    },
   teamMode:{
       type:String,
       default:"TPP"
   },
   typeOfSquad:{
       type:String,
       default:"Squad"
   },
   maps:{
       type:String,
       default:"Erangel"
   },
   password:{
       type:String,
       default:"qwertyuiop"
   },
})

const Room=new mongoose.model("Room",roomSchema);


app.get("/room",function(req,res){
    Room.find({},function(err,foundDetails){
        res.send(foundDetails);
    })
    
})

app.post("/room",function(req,res){
   
       const room1=new Room({
        roomName:req.body.roomName,
        teamMode:req.body.teamMode,
        typeOfSquad:req.body.typeOfSquad,
        maps:req.body.maps,
        password:req.body.password
       }) 
       room1.save();
})

app.delete("/room",function(req,res){
    Room.deleteOne({roomName:req.body.roomName},function(err){
        res.send("deleted");
    })
})


app.get("/room/:roomName",function(req,res){
    Room.findOne({roomName:req.params.roomName},function(err,foundRoom){
        res.send(foundRoom);

    })
})

module.exports=Room;


// app.listen(process.env.PORT || 3000,function(){
//     console.log("server running on port 3000");
    
// })