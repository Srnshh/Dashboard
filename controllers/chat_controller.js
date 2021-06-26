const Post = require('../models/post');
const User = require('../models/user');
const Message = require('../models/message');
const ObjectID=require("mongodb").ObjectID;
const mongodb=require("mongodb");
const chatnotification = require('../models/chatnotification');


module.exports.chat = async function(req, res){

    try{
        let u=await User.findById(req.params.id);
        if(!u){
            return res.render("errorpage",{title:"Error",pass:"404 Not Found"});   
        }
        
       
        let message1 = await Message.findOne({user1:req.user.id,user2:req.params.id}).populate("user1").populate("user2");

        let message2 = await Message.findOne({user1:req.params.id,user2:req.user.id}).populate("user1").populate("user2");
       
        if(message1){
           
           
           
           return res.render('_chat_box',{
            title: "Chat",
            message: message1,
            forform:req.params.id
        });

        }
        else if(message2){
     
            let message3 = await Message.create({
                user1:req.user.id,
                user2:req.params.id,
                chatroom:req.params.id+req.user.id
            })
            message3=await message3.populate('user1').populate('user2').execPopulate();
            return res.render('_chat_box',{
                title: "Chat",
                message:message3,
                forform:req.params.id
                
            });
    
            }
    
            let message4 = await Message.create({
                user1:req.user.id,
                user2:req.params.id,
                chatroom:req.user.id+req.params.id
            })
            
            message4=await message4.populate('user1').populate('user2').execPopulate();
            return res.render('_chat_box',{
            title: "Chat",
            message:message4,
            forform:req.params.id
        });
    

    }catch(err){
        
        return res.render("errorpage",{title:"Error",pass:"404 Not Found"});
    }
   
}
module.exports.submit = async function(req, res){
    try{
        const d = (new Date()).toLocaleString();
        let message1 = await Message.findOne({user1:req.user.id,user2:req.params.id}).populate("user1").populate("user2");

        let message2 = await Message.findOne({user1:req.params.id,user2:req.user.id}).populate("user1").populate("user2");
     
       var object={
           _id:new ObjectID(),
           content:req.body.textarea,
           name:req.user.name,
           email:req.user.email,
           date:d
       }
       
       if(message1){
           message1.messages.push(object);
           message1.save();
           let noti = await chatnotification.findOne({user : message1.user2.email});
        var ob={
            _id:new ObjectID(),
            content:`You have got a message from ${message1.user1.name} check it now`,
            anchor:`/chat/${req.user.id}`
        }
        noti.allnoty.unshift(ob);
        noti.save();
            
    

     }
        if(message2){
            
            message2.messages.push(object);
            message2.save();


        }
        if(!message2){
            let message2 = await Message.create({
                user1:req.params.id,
                user2:req.user.id,
                chatroom:req.user.id+req.params.id
            });
            message2.messages.push(object);
            message2.save();

        }
        
        if (req.xhr){
           
            

            return res.status(200).json({
                data: {
                    message: object
                }
                
            });
        }

        
        return res.redirect('back');

    }catch(err){
        return res.render("errorpage",{title:"Error",pass:"404 Not Found"});
    }
  
}


module.exports.deleteforme = async function(req, res){
    try{
        let message1 = await Message.findOne({user1:req.user.id,user2:req.params.id});
        

        
        let message = await Message.updateOne({_id:message1._id},{ $pull: {messages: { _id: mongodb.ObjectId(req.params.id2) }}});

        
     
       //console.log(message1,message,req.params.id2,req.params.id);

       req.flash('success', 'deleted');
        return res.redirect('back');

    }catch(err){
        return res.render("errorpage",{title:"Error",pass:"404 Not Found"});
    }
  
}



module.exports.deleteforeveryone = async function(req, res){
    try{
        let message1 = await Message.findOne({user1:req.user.id,user2:req.params.id});
        let message2 = await Message.findOne({user1:req.params.id,user2:req.user.id})

        let message = await Message.updateOne({_id:message1._id},{ $pull: {messages: { _id: mongodb.ObjectId(req.params.id2) }}});
        let messager = await Message.updateOne({_id:message2._id},{ $pull: {messages: { _id: mongodb.ObjectId(req.params.id2) }}});

        
     
       //console.log(message1,message,req.params.id2,req.params.id);

        req.flash('success', 'deleted');
        return res.redirect('back');

    }catch(err){
        
        return res.render("errorpage",{title:"Error",pass:"404 Not Found"});
    }
  
}



module.exports.alldelete = async function(req, res){
    try{
        let message1 = await Message.findOne({user1:req.user.id,user2:req.params.id});
        

        
        message1.messages=[];
        message1.save();
        
     
       //console.log(message1,message,req.params.id2,req.params.id);

       req.flash('success', 'deleted');
        return res.redirect('back');

    }catch(err){
        return res.render("errorpage",{title:"Error",pass:"404 Not Found"});
    }
  
}
