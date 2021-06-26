const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');
const H = require('../models/heirarchy');
const notinotification = require('../models/notinotification');
const chatnotification = require('../models/chatnotification');
const ObjectID=require("mongodb").ObjectID;
const mongodb=require("mongodb");

module.exports.home = async function(req, res){

    try{
        
        
        return res.render('home', {
            title: "Home"
            
            
            
        });

    }catch(err){
        console.log('Error', err);
        return res.redirect('back');
    }
   
}
module.exports.friends = async function(req, res){

    try{
         // populate the user of each post
      
    
        let users = await User.find({}).sort('-createdAt');

        return res.render('friendssnew', {
            title: "Friends",
            
            all_users: users
        });

    }catch(err){
        
        return res.redirect('back');
    }
   
}

module.exports.notinotification = async function(req, res){

    try{
         // populate the user of each post
      
    
        let noti = await notinotification.findOne({user:req.user.email});

        return res.render('notinotification', {
            title: "Notification",
            
            
            
            all: noti.allnoty
        });

    }catch(err){
        console.log('Error', err);
        return res.redirect('back');
    }
   
}

module.exports.alldeletenoty = async function(req, res){

    try{
         // populate the user of each post
      
    
        let noti = await notinotification.findOne({user:req.user.email});
        noti.allnoty=[];
        noti.save();
        req.flash('success', 'Clear notification');

        return res.redirect('back');
            

    }catch(err){
        console.log('Error', err);
        return res.redirect('back');
    }
   
}

module.exports.deletenoty = async function(req, res){
    try{
        let noti1 = await notinotification.findOne({user:req.user.email});
        

        
        let noti = await notinotification.updateOne({_id:noti1._id},{ $pull: {allnoty: { _id: mongodb.ObjectId(req.params.id) }}});

        
     
       //console.log(message1,message,req.params.id2,req.params.id);

       req.flash('success', 'deleted');
        return res.redirect('back');

    }catch(err){
        //req.flash('error', err);
        // added this to view the error on console as well
        console.log(err);
        return res.redirect('back');
    }
  
}


module.exports.chatnotification = async function(req, res){

    try{
         // populate the user of each post
      
    
        let noti = await chatnotification.findOne({user:req.user.email});

        return res.render('chatnotification', {
            title: "Chat Notification",
            
            
            
            all: noti.allnoty
        });

    }catch(err){
        
        return res.redirect('back');
    }
   
}

module.exports.alldeletechatnoty = async function(req, res){

    try{
         // populate the user of each post
      
    
        let noti = await chatnotification.findOne({user:req.user.email});
        noti.allnoty=[];
        noti.save();
        req.flash('success', 'Clear notification');

        return res.redirect('back');
            

    }catch(err){
        
        return res.redirect('back');
    }
   
}

module.exports.deletechatnoty = async function(req, res){
    try{
        let noti1 = await chatnotification.findOne({user:req.user.email});
        

        
        let noti = await chatnotification.updateOne({_id:noti1._id},{ $pull: {allnoty: { _id: mongodb.ObjectId(req.params.id) }}});

        
     
       //console.log(message1,message,req.params.id2,req.params.id);

       req.flash('success', 'deleted');
        return res.redirect('back');

    }catch(err){
        
        return res.redirect('back');
    }
  
}


module.exports.heirarchy = async function(req, res){

    try{
         // populate the user of each post
      
    
        let h = await H.find({});
        
        //  console.log(x);
        return res.render('heirarchy', {
            title: "Heirarchy",
            topass: h
            
            
        });

    }catch(err){
        console.log('Error', err);
        return res.redirect('back');
    }
   
}
module.exports.giventask = async function(req, res){
    try{
        let post1 = await Post.find({user1 :req.user._id});
        
        
        for(let i=0;i<post1.length;i++){
           
            var countDownDate = new Date(post1[i].enddate).getTime();
            var now = new Date().getTime();
            var distance = countDownDate - now;
           // console.log(distance);
            if (distance < 0 && post1[i].status!="completed") {
               // console.log("ll")
                post1[i].status="expired";
                await post1[i].save();
              }

        }


        let post = await Post.find({user1 :req.user._id})
        .sort('-createdAt')
        .populate("user2");
        

        if(post){
           // console.log(post);
            return res.render('giventask',
            {title: "Given Task",
            all_post : post
               
           });

        
        }
        
        
        else{
            return res.render('giventask',
            {title: "Given Task",
            all_post : []
               
           });
        }
    }
    

    catch(err){
       
        return res.redirect('back');
    }
  
}
module.exports.delete = async function(req, res){

    try{
        let post = await Post.findById(req.params.id);

        if (post.user1 == req.user.id){
            post.remove();

            await Comment.deleteMany({post: req.params.id});        



            req.flash('success', 'Task Deleted');

            return res.redirect('back');
        }else{
            req.flash('error', 'You cannot delete this task!');
            return res.redirect('back');
        }

    }catch(err){
        
        return res.redirect('back');
    }
    
}
module.exports.task = async function(req, res){

    try{
        let post = await Post.findById(req.params.id) 
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        });
        
        
        if (post.user1 == req.user.id || post.user2 == req.user.id){

            return res.render('task', {
                title: "Task",
                
                post: post
            });

            



            

           
        }

    }catch(err){
        
       return res.render("errorpage",{title:"Error",pass:"404 Not Found"});  
    }
    
}
module.exports.ongoingtask = async function(req, res){
    try{
        let post1 = await Post.find({user2 :req.user._id,status:"ongoing"})
        for(let i=0;i<post1.length;i++){
           
            var countDownDate = new Date(post1[i].enddate).getTime();
            var now = new Date().getTime();
            var distance = countDownDate - now;
           // console.log(distance);
            if (distance < 0 && post1[i].status!="completed") {
               // console.log("ll")
                post1[i].status="expired";
                await post1[i].save();
              }

        }
        
       
        let post2 = await Post.find({user2 :req.user._id,status:"expired"})
        .sort('-createdAt')
        .populate("user1");
        post1 = await Post.find({user2 :req.user._id,status:"ongoing"})
        .sort('-createdAt')
        .populate("user1");
        let post=post2.concat(post1); 

        if(post){
            
            return res.render('ongoingtask',
            {title: "Ongoing Task",
            all_post : post
               
           });

        
        }
        
        
        else{
            return res.render('ongoingtask',
            {title: "Ongoing Task",
            all_post:[]
               
           });
        }
    }
    

    catch(err){
        req.flash('error', err);
        // added this to view the error on console as well
        //console.log(err);
        return res.redirect('back');
    }
  
}
module.exports.complete = async function(req, res){

    try{
        
        let post = await Post.findById(req.params.id).populate("user1").populate("user2");

        if (post.user2.id == req.user.id){
            var countDownDate = new Date(post.enddate).getTime();
            var now = new Date().getTime();
            var distance = countDownDate - now;
            const d = (new Date()).toLocaleString();
            if(distance>0){
            post.status="completed";
            post.completedon=d
            post.tasksuccess="ON TIME"
            post.save();
            }
            else{
                post.status="completed";
                post.completedon=d
                post.tasksuccess="NOT ON TIME"
                post.save();  
            }
            //console.log(post.user1.email);
            let noti = await notinotification.findOne({user : post.user1.email});
            
            var object={
                _id:new ObjectID(),
                content: `${post.user2.name} completed his task check it now`,
                anchor:`/task/${post._id}`
            }
            
            noti.allnoty.unshift(object);
            noti.save();
            

            req.flash('success', 'You have successfully Completed this task');

            return res.redirect('back');
        }else{
            req.flash('error', 'You cannot complete this task!');
            return res.redirect('/giventask');
        }

    }catch(err){
        
        return res.redirect('back');
    }
    
}
module.exports.completedtask = async function(req, res){
    try{
        let post = await Post.find({user2 :req.user._id,status:"completed"} )
        .sort('-createdAt')
        .populate("user1");

        if(post){
            //console.log(post);
            return res.render('completedtask',
            {title: "Completed Task",
            all_post : post
               
           });

        
        }
        
        
        else{
            return res.render('completedtask',
            {title: "Completed Task",
            all_post:[] 
           });
        }
    }
    

    catch(err){
        req.flash('error', err);
        // added this to view the error on console as well
        console.log(err);
        return res.redirect('back');
    }
  
}

// module.exports.actionName = function(req, res){}


// using then
// Post.find({}).populate('comments').then(function());

// let posts = Post.find({}).populate('comments').exec();

// posts.then()
