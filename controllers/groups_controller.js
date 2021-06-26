//& for users and # for groups
const User = require('../models/user');
const fs = require('fs');
const path = require('path');
const message = require('../models/message');
const Group = require('../models/group');
const H = require('../models/heirarchy');
const Post = require('../models/post');
const Project = require('../models/project');
const Comment = require('../models/comment');
const Groupmessages = require('../models/groupmessages');
const notinotification = require('../models/notinotification');
const chatnotification = require('../models/chatnotification');
const dailylog = require('../models/dailylog');
const ObjectID=require("mongodb").ObjectID;
const mongodb=require("mongodb");

module.exports.creategroup = async function(req, res){
    try{
        
       
        if(req.user.access == "admin"){
        return res.render('creategroup',{
            title:"Creategroup"
        });
    }
    else{
        return res.render("errorpage",{title:"Error",pass:"Unauthorized"}); 
    }
    }catch(err){
       
     
        return res.render("errorpage",{title:"Error",pass:"404 Not Found"});
    }
  
}

// module.exports.submit = async function(req, res){
//     try{
//         //regex expression
//         // let val='^a'
//         // let users = await User.find({name: new RegExp(val) }).sort('-createdAt');
//         let value=req.user.priority.split("&");
//         // let y=value[0].split("#").length;
//         // console.log(y);
//         let v1=await Group.findOne({value: value[0] })
//         let z=v1.members;
        
//         // let x="^"+value[0]+"#1";
//         // let v=await Group.find({value: new RegExp(x) }).sort('-createdAt');
        
//         v1.totalsubgroups=parseInt(v1.totalsubgroups)+1;
//         let y=v1.totalsubgroups;
//         let group = await Group.create({
//             name: req.body.name,
//             value: value[0]+"#"+y,
//             members:z,
//             Sno:y,
//             owneremail:req.user.email,
//             totalsubgroups:0
//         });
        
//         v1.save();
     
//         req.flash('success', 'Group created!');
//         return res.redirect('/group/creategroup');

//     }catch(err){
//         req.flash('error', err);
//         // added this to view the error on console as well
//         console.log(err);
//         return res.redirect('back');
//     }
  
// }
module.exports.submit = async function(req, res){
    try{
        
       
        
        if(req.user.access =="admin"){
        let g=await Group.findOne({name: req.body.name })
       
        
        if(g){
            //console.log("k");
            req.flash('success', 'Group name already exist');
            return res.redirect('back');   
        }
        else{
        
        let group = await Group.create({
            name: req.body.name,
            
            members:[req.user.email]
           
       

        });
        let a=await Groupmessages.create({
            user:req.user._id,
            chatroom:req.body.name
         });
        // let h=await H.create({
        //     Id: req.body.name,
        //     Name:req.body.name,
        //     Parent:req.user.email
            
            
           
       

        // });
        
     
        req.flash('success', 'Group created!');
        return res.redirect('/group/mygroups');
    }
        }
        else{
            return res.render("errorpage",{title:"Error",pass:"Unauthorized"});   
        }
    }catch(err){
        
        return res.redirect('back');
    }
  
}

module.exports.mygroups = async function(req, res){
    try{
        
    let v=await Group.find({members:{$in:[req.user.email]}}).sort('-createdAt');
        
        return res.render('mygroups',{
            title:"my groups",
            groups:v
        });
     

    }catch(err){
     
        // added this to view the error on console as well
        return res.render("errorpage",{title:"Error",pass:"404 Not Found"});
    }
  
}
module.exports.checkgroup = async function(req, res,next){
  
        
    let v=await Group.find({name:req.params.id,members:{$in:[req.user.email]}})
    
        if(v.length){
        return next();
        }
        return res.render("errorpage",{title:"Error",pass:"Unauthorized"});
        
        

   
  
}
module.exports.checkuser = async function(req, res,next){
    try{
    v=await User.findOne({ _id: mongodb.ObjectId(req.params.id2) ,under:{$in:[req.user.email]}})
    
        //console.log(v,req.params.id2,req.user.email);
        if(v){
        return next();
        }
        
       return res.render("errorpage",{title:"Error",pass:"Unauthorized"});
    }catch(err){
        return res.render("errorpage",{title:"Error",pass:"Unauthorized"});
    }       
     

   
  
}
module.exports.gotogroup = async function(req, res){
  
   
    
        return res.render('group',{
            title:req.params.id,
            groupname:req.params.id
        });
    

        
 



    }

    module.exports.allprojects = async function(req, res){
        try{
            
        let v=await Project.find({group:req.params.id}).sort('-createdAt');
            
            return res.render('allprojects',{
                title:"All projects",
                all_projects:v,
                groupname:req.params.id
            });
         
    
        }catch(err){
         
            // added this to view the error on console as well
            return res.render("errorpage",{title:"Error",pass:"404 Not Found"});
        }
      
    }    



    module.exports.addproject = async function(req, res){
  
   
    
        return res.render('addproject',{
            title:"Add Project",
            groupname:req.params.id
            
        });
    

        
 



}


module.exports.submitproject = async function(req, res){
   

    if(req.user.designation == "Center head" || req.user.designation == "Group head"){
        //console.log(req.file);
        try{
           
            
            Project.uploadedAvatar(req, res, async function(err){
                if (err) {console.log('*****Multer Error: ', err)}
                var p=await Project.create({title:req.body.title,
                    about:req.body.about,
                    status:req.body.status,
                    group:req.params.id
                    
                });
            
            
                //console.log(req.file);
                if (req.file){
                  


                    // this is saving the path of the uploaded file into the avatar field in the user
                    p.pdf = Project.avatarPath + '/' + req.file.filename;
                }
                //console.log(user);
                p.save();      
                    req.flash('success', 'Project created!');
                    //console.log(p);
                    return res.redirect(`/group/${req.params.id}/allprojects`);
                

            })

        }catch(err){
           
            return res.redirect('back');
        }


    }else{
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }
}


module.exports.download = async function(req, res){
    try{
        
    let v=await Project.findById(req.params.id2)
      let a=__dirname+"/../"+v.pdf  
      res.download(a);
     

    }catch(err){
     
        // added this to view the error on console as well
        return res.render("errorpage",{title:"Error",pass:"404 Not Found"});
    }
  
}  
module.exports.deleteproject = async function(req, res){
    try{
        
    let v=await Project.findByIdAndDelete(req.params.id2);
    req.flash('success', 'Deleted!');

    return res.redirect(`/group/${req.params.id}/allprojects`);

    }catch(err){
     
        // added this to view the error on console as well
        return res.render("errorpage",{title:"Error",pass:"404 Not Found"});
    }
  
} 


module.exports.markascompleted = async function(req, res){
    try{
        
    let v=await Project.findById(req.params.id2);
    v.status="completed";
    v.save();

    req.flash('success', 'mark as completed');

    return res.redirect(`/group/${req.params.id}/allprojects`);

    }catch(err){
     
        // added this to view the error on console as well
        return res.render("errorpage",{title:"Error",pass:"404 Not Found"});
    }
  
} 

module.exports.editproject = async function(req, res){
    try{
        
        let v=await Project.findById(req.params.id2);
        
        return res.render('editproject',{
            title:"Edit Project",
            pass:v,
            groupname:req.params.id,
            projectname:req.params.id2
        });
     

    }catch(err){
     
        // added this to view the error on console as well
        return res.render("errorpage",{title:"Error",pass:"404 Not Found"});
    }
  
} 

module.exports.updateproject = async function(req, res){
   

    if(req.user.designation == "Center head" || req.user.designation == "Group head"){
        //console.log(req.file);
        try{
           
            
            Project.uploadedAvatar(req, res, async function(err){
                if (err) {console.log('*****Multer Error: ', err)}
                let p=await Project.findById(req.params.id2);
                p.title=req.body.title;
                p.about=req.body.about;
                p.status=req.body.status;
                   
                    
          
            
            
                //console.log(req.file);
                if (req.file){
                    if (p.pdf){
                        fs.unlinkSync(path.join(__dirname, '..', p.pdf));
                    }

                    // this is saving the path of the uploaded file into the avatar field in the user
                    p.pdf = Project.avatarPath + '/' + req.file.filename;
                    
                }
                //console.log(user);
                p.save();      
                    req.flash('success', 'Project updated!');
                    //console.log(p);
                    return res.redirect(`/group/${req.params.id}/allprojects`);
                

            })

        }catch(err){
            
            return res.redirect('back');
        }


    }else{
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }
}

module.exports.showproject = async function(req, res){
    try{
        
    let v=await Project.findById(req.params.id2);
    if(!v){
        return res.render("errorpage",{title:"Error",pass:"404 Not Found"}); 
    }
    
        return res.render('project',{
            title:"Project",
            pass:v,
            groupname:req.params.id
        });
     
    
    }catch(err){
     
        return res.render("errorpage",{title:"Error",pass:"404 Not Found"});
    }
  
}    



    module.exports.addnewuser = async function(req, res){
  
   
    
        return res.render('addnewuser',{
            title:"Add user",
            groupname:req.params.id
            
        });
    

        
 



}


module.exports.createuser = async function(req, res){
    if (req.body.password != req.body.confirm_password){
        req.flash('error', 'Passwords do not match');
        return res.redirect('back');
    }
    var u=await User.findOne({email: req.body.hidden1 });
    var g=await Group.findOne({name: req.body.hidden2 });
    
    
    User.findOne({email: req.body.email}, function(err, user){
        if(err){req.flash('error', err); return}

        if (!user){
          
            u.under.push(u.email);
            let h=u.under;
            g.members.push(req.body.email);
            User.create({name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            designation:req.body.designation,
            group:req.params.id,
        under:h} , function(err, user){
                if(err){req.flash('error', err); return}
                g.save();
                H.create({
                    Id: req.body.email,
                    Name:req.body.name+"["+req.body.designation+"]",
                    Parent:req.user.email
                });
                Groupmessages.create({
                   user:user._id,
                   chatroom:req.params.id
                });
                notinotification.create({
                    user:user.email,
                    
                 });
                 chatnotification.create({
                    user:user.email,
                    
                 }); 

                req.flash('success', 'User created!');
                //console.log("jj");
                return res.redirect(`/group/${req.params.id}/myusersingroup`);
            })
        }else{
            req.flash('error', 'Email id already exist');
            return res.redirect('back');
        }

    });
}


module.exports.usersingroup = async function(req, res){
  
    //let g=await User.find({under:{$in:[req.user.email]}});
    //let u=await User.find({});


    let u = await Group.findOne({name:req.params.id}) ;
    g=[];
    for(let i=0;i<u.members.length;i++){
        let k = await User.findOne({email:u.members[i]}) ;
        g.push(k);
    }



    return res.render('friendssnew',{
        title:"All users",
        all_users:g
    });


    




}

module.exports.myusersingroup = async function(req, res){
  
    let g=await User.find({group:req.params.id,under:{$in:[req.user.email]}});
    //let u=await User.find({});


    



    return res.render('mymembers',{
        title:"members under me",
        all_users:g,
        topass:req.params.id
    });


    




}

module.exports.assigntask = async function(req, res){
  
        let g=await User.findById(req.params.id2);


    



    return res.render('assigntask',{
        title:"Assigntask",
        topass:g,
        groupname:req.params.id
    });


    




}



module.exports.assigntasksubmit = async function(req, res){
    try{
        let user = await User.findOne({email : req.body.email,under:{$in:[req.user.email]}});
        if(!user){
            return res.render("errorpage",{title:"Error",pass:"Unauthorized"});
        }
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
        
        return res.render("errorpage",{title:"Error",pass:"Unauthorized"});
    }
  
}



module.exports.hisgiventask = async function(req, res){
    try{
        let user=await User.findById(req.params.id2);
        let post1 = await Post.find({user1 :req.params.id2});
        
        
        for(let i=0;i<post1.length;i++){
           
            var countDownDate = new Date(post1[i].enddate).getTime();
            var now = new Date().getTime();
            var distance = countDownDate - now;
            //console.log(distance);
            if (distance < 0 && post1[i].status!="completed") {
                
                post1[i].status="expired";
                await post1[i].save();
              }

        }


        let post = await Post.find({user1 :req.params.id2})
        .sort('-createdAt')
        .populate("user2");
        

        if(post){
           // console.log(post);
            return res.render('hisgiventask',
            {title: "His Given Task",
            all_post : post,
            topass:user,
            pass:req.params.id
               
           });

        
        }
        
        
        else{
            return res.render('hisgiventask',
            {title: "His Given Task",
            all_post : [],
            topass:user,
            pass:req.params.id
               
           });
        }
    }
    

    catch(err){
        
        return res.redirect('back');
    }
  
}


module.exports.hisongoingtask = async function(req, res){
    try{
        let user=await User.findById(req.params.id2);
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
        post1 = await Post.find({user2 :req.params.id2,status:"ongoing"})
        .sort('-createdAt')
        .populate("user1");
        let post2 = await Post.find({user2 :req.params.id2,status:"expired"})
        .sort('-createdAt')
        .populate("user1");
        let post=post1.concat(post2); 

        if(post){
            
            return res.render('hisongoingtask',
            {title: "His Ongoing Task",
            all_post : post,
            topass:user,
            pass:req.params.id
               
           });

        
        }
        
        
        else{
            return res.render('hisongoingtask',
            {title: "His Ongoing Task",
            all_post:[],
            topass:user,
            pass:req.params.id
               
           });
        }
    }
    

    catch(err){
        return res.render("errorpage",{title:"Error",pass:"404 Not Found"});
    }
  
}


module.exports.hiscompletedtask = async function(req, res){
    try{
        let user=await User.findById(req.params.id2);
        let post = await Post.find({user2 :req.params.id2,status:"completed"} )
        .sort('-createdAt')
        .populate("user1");

        if(post){
            //console.log(post);
            return res.render('hiscompletedtask',
            {title: "His Completed Task",
            all_post : post,
            topass:user,
            pass:req.params.id
               
           });

        
        }
        
        
        else{
            return res.render('hiscompletedtask',
            {title: "His Completed Task",
            all_post:[],
            topass:user,
            pass:req.params.id
           });
        }
    }
    

    catch(err){
        return res.render("errorpage",{title:"Error",pass:"404 Not Found"});
    }
  
}

module.exports.histask = async function(req, res){

    try{
        let post = await Post.findById(req.params.id3) 
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        });
        if(!post){
            return res.render("errorpage",{title:"Error",pass:"404 Not Found"});  
        }
        

            return res.render('histask', {
                title: "His Task",
                
                post: post
            });

            



            

           
        

    }catch(err){
        return res.render("errorpage",{title:"Error",pass:"404 Not Found"});
    }
    
}

module.exports.groupchat = async function(req, res){

    try{
       
        
       
        let gmessage = await Groupmessages.findOne({user:req.user.id,chatroom:req.params.id}).populate("user");

        
       
        
           
           
           
           return res.render('groupchat',{
            title: "Group Chat",
            message: gmessage,
            forform:req.params.id
        });

      

    }catch(err){
        return res.render("errorpage",{title:"Error",pass:"404 Not Found"});
    }
   
}
module.exports.groupsubmit = async function(req, res){
    try{
        const d = (new Date()).toLocaleString();
        let gmessage = await Groupmessages.find({chatroom:req.params.id});
       var object={
           _id:new ObjectID(),
           content:req.body.textarea,
           name:req.user.name,
           email:req.user.email,
           date:d
       }
       

       
     for(let i=0;i<gmessage.length;i++){
         gmessage[i].messages.push(object);
         gmessage[i].save();
     }

     let member = await Group.findOne({name:req.params.id});  
     for(let i=0;i<member.members.length;i++){
        if(member.members[i]!=req.user.email) {
        let noti = await chatnotification.findOne({user : member.members[i]});
        var ob={
            _id:new ObjectID(),
            content:`You have got a message in ${req.params.id} group check it now`,
            anchor:`/group/${req.params.id}/groupchat`
        }
        noti.allnoty.unshift(ob);
        noti.save();
    }
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
        
        return res.redirect('back');
    }
  
}


module.exports.deleteforme = async function(req, res){
    try{
        let gmessage = await Groupmessages.findOne({user:req.user.id,chatroom:req.params.id});
        

        
        let gmessage1 = await Groupmessages.updateOne({_id:gmessage._id},{ $pull: {messages: { _id: mongodb.ObjectId(req.params.id2) }}});

        
     
       //console.log(message1,message,req.params.id2,req.params.id);

       req.flash('success', 'deleted');
        return res.redirect('back');

    }catch(err){
        return res.render("errorpage",{title:"Error",pass:"404 Not Found"});
    }
  
}



module.exports.deleteforeveryone = async function(req, res){
    try{
        
        let gmessage = await Groupmessages.find({chatroom:req.params.id});

        for(let i=0;i<gmessage.length;i++){
        let gmessage1 = await Groupmessages.updateOne({_id:gmessage[i]._id},{ $pull: {messages: { _id: mongodb.ObjectId(req.params.id2) }}});
       
        }
     
       //console.log(message1,message,req.params.id2,req.params.id);

        req.flash('success', 'deleted');
        return res.redirect('back');

    }catch(err){
        return res.render("errorpage",{title:"Error",pass:"404 Not Found"});
    }
  
}


module.exports.alldelete = async function(req, res){
    try{
        let gmessage = await Groupmessages.findOne({user:req.user.id,chatroom:req.params.id});
        

        
        gmessage.messages=[];
        gmessage.save();
        
     
       //console.log(message1,message,req.params.id2,req.params.id);

       req.flash('success', 'deleted');
        return res.redirect('back');

    }catch(err){
        return res.render("errorpage",{title:"Error",pass:"404 Not Found"});
    }
  
}


module.exports.deletegroup = async function(req, res){

    try{
        if(req.user.access == "admin"){
        await Groupmessages.deleteMany({chatroom:req.params.id});
        let group = await Group.findOne({name:req.params.id});
        
        for(let i=0;i<group.members.length;i++){
        if(group.members[i]!=req.user.email){
         let a=await User.findOne({email:group.members[i]});
         let id=a._id;   
       
        await User.findOneAndDelete({email:group.members[i]});
        await chatnotification.findOneAndDelete({user:group.members[i]});
        await notinotification.findOneAndDelete({user:group.members[i]});
        await H.findOneAndDelete({Id:group.members[i]});

        await dailylog.findOneAndDelete({user:id});
        await message.deleteMany({user1:id});
        await message.deleteMany({user2:id});

        let y=await Post.find({user1:id});
        for(let j=0;j<y.length;j++){
            y[j].remove();

            await Comment.deleteMany({post: y[j]._id});
        }   
        y=await Post.find({user2:id});
        for(let j=0;j<y.length;j++){
            y[j].remove();

            await Comment.deleteMany({post: y[j]._id});
        }  
        
        }
    }
    await Project.deleteMany({group:req.params.id}); 
    
    await Group.findOneAndDelete({name:req.params.id});  
    req.flash('success', "deleted");
    return res.redirect('back');    
}
    
    }catch(err){
       
        return res.redirect('back');
    }
    
}


module.exports.removeuser = async function(req, res){

    try{
        let u=await User.find({email:req.query.removeuser,under:{$in:[req.user.email]},group:req.params.id})
        //console.log(u)
        if(u.length){
        
        
        let group1 = await Group.findOne({name:req.params.id});
        let group = await Group.updateOne({_id:group1._id},{ $pull: {members: req.query.removeuser}});

        
        
       // await User.findOneAndDelete({email:group.members[i]});
        await chatnotification.findOneAndDelete({user:req.query.removeuser});
        await notinotification.findOneAndDelete({user:req.query.removeuser});
        await H.findOneAndDelete({Id:req.query.removeuser});

        let a=await User.findOne({email:req.query.removeuser});
        let id=a._id;  
        //console.log(id)


        await dailylog.findOneAndDelete({user:id});
        await message.deleteMany({user1:id});
        await message.deleteMany({user2:id});

        let y=await Post.find({user1:id});
        for(let j=0;j<y.length;j++){
            y[j].remove();

            await Comment.deleteMany({post: y[j]._id});
        }   
        y=await Post.find({user2:id});
        for(let j=0;j<y.length;j++){
            y[j].remove();

            await Comment.deleteMany({post: y[j]._id});
        }  
        
        
    
    await User.findOneAndDelete({email:req.query.removeuser});
    req.flash('success', "User removed successfully");
    return res.redirect(`/group/${req.params.id}/removeuser`);    
}
else{
    req.flash('error', "You cannot remove this user");
    return res.redirect(`/group/${req.params.id}/removeuser`);  
}
    
    }catch(err){
        return res.render("errorpage",{title:"Error",pass:"404 Not Found"});
    }
    
}


module.exports.toremoveuser = async function(req, res){
    try{
        
       

        return res.render('removeuser',{
            title:"Remove user",
            groupname:req.params.id
        });

    }catch(err){
       
     
        return res.render("errorpage",{title:"Error",pass:"404 Not Found"});
    }
  
}