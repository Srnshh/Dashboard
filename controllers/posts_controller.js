const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');
const notinotification = require('../models/notinotification');
const ObjectID=require("mongodb").ObjectID;
const mongodb=require("mongodb");


module.exports.submit = async function(req, res){
    try{
        let user = await User.findOne({email : req.body.email});
        const d = (new Date()).toLocaleString();
        var countDownDate = new Date(req.body.enddate).getTime();
        var now = new Date().getTime();
        var distance = countDownDate - now;
        var status="ongoing";

        if (distance < 0) {
            status="expired"
        }

        if(user){

        let post = await Post.create({
            content: req.body.content,
            user1: req.user._id,
            user2: user._id,
            postdate:d,
            startdate:req.body.startdate,
            enddate:req.body.enddate,
            status:status,
            completedon:"Not yet",
            tasksuccess:"Not yet"
        });
        let noti = await notinotification.findOne({user : user.email});
        var object={
            _id:new ObjectID(),
            content:"You have assigned a new task check it now",
            anchor:`/task/${post._id}`
        }
        noti.allnoty.unshift(object);
        noti.save();
            

      
        req.flash('success', 'Task assigned succesfully');
        return res.redirect('/giventask');
    }
    else{
        req.flash('error', 'Email not found');
        return res.redirect('back');

    }

    }catch(err){
       
        return res.redirect('back');
    }
  
}








