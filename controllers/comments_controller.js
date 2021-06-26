const Comment = require('../models/comment');
const Post = require('../models/post');
const notinotification = require('../models/notinotification');
const ObjectID=require("mongodb").ObjectID;
const mongodb=require("mongodb");


module.exports.submit = async function(req, res){

    try{
        let post = await Post.findById(req.body.post).populate("user1").populate("user2");
        const d = (new Date()).toLocaleString();
        if (post){
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id,
                commentdate:d
            });

            post.comments.push(comment);
            post.save();

            if(post.user1.email!=req.user.email){
                let noti = await notinotification.findOne({user : post.user1.email});
                var object={
                    _id:new ObjectID(),
                    content:"You have got a comment in your task check it now",
                    anchor:`/task/${post._id}`
                }
                noti.allnoty.unshift(object);
                noti.save();  

            }
            if(post.user2.email!=req.user.email){
                let noti = await notinotification.findOne({user : post.user2.email});
                var object={
                    _id:new ObjectID(),
                    content:"You have got a comment in your task check it now",
                    anchor:`/task/${post._id}`
                }
                noti.allnoty.unshift(object);
                noti.save();
                
            }



            req.flash('success', 'Comment published!');

            res.redirect('back');
        }
    }catch(err){
        
        res.redirect('back');
    }
    
}
module.exports.delete = async function(req, res){

    try{
        let comment = await Comment.findById(req.params.id);

        if (comment.user == req.user.id){

            let postId = comment.post;

            comment.remove();

            let post = await Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}});


            // send the comment id which was deleted back to the views
           

            req.flash('success', 'Comment deleted!');

            return res.redirect('back');
        }else{
            req.flash('error', 'Unauthorized');
            return res.redirect('back');
        }
    }catch(err){
        
        return res.render("errorpage",{title:"Error",pass:"404 Not Found"});
    }
    
}
