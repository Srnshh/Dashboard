const User = require('../models/user');
const fs = require('fs');
const Post = require('../models/post');
const path = require('path');
const notinotification = require('../models/notinotification');
const chatnotification = require('../models/chatnotification');
const H = require('../models/heirarchy');
const { totalmem } = require('os');

// let's keep it same as before
module.exports.profile =async function(req, res){
    try{
    let user= await User.findById(req.params.id);
    //console.log(user)
    let post1 = await Post.find({user2 :req.params.id})
    
    if(post1.length){
    let post2 = await Post.find({user2 :req.params.id,status:"ongoing"})
    let post3 = await Post.find({user2 :req.params.id,tasksuccess:"ON TIME"})
    let post4 = await Post.find({user2 :req.params.id,tasksuccess:"NOT ON TIME"})
    var total=post1.length;
    var ongoing=(post2.length*100/post1.length).toFixed(2);
    var ontime=(post3.length*100/post1.length).toFixed(2);
    var notontime=(post4.length*100/post1.length).toFixed(2);
    
    }
    else{
        var total=0
        var ongoing=0
        var ontime=0
        var notontime=0
    }
        if(user){
        
        return res.render('user_profile', {
            title: `${user.name}'s Profile`,
            profile_user: user,
            total:total,
            ongoing:ongoing,
            ontime:ontime,
            notontime:notontime
        });
    }
    else{
        return res.render("errorpage",{title:"Error",pass:"404 Not Found"});
    }
    
}catch(err){
    return res.render("errorpage",{title:"Error",pass:"404 Not Found"});
}



}

module.exports.changepass = function(req, res){

    
        return res.render('changepass', {
            title: "Change Password"
            
        });
    
    
    }
module.exports.change = function(req, res){

    User.findById(req.user.id, function(err, user){
        if (req.body.password != req.body.confirm_password){
            req.flash('error', 'Passwords do not match');
            return res.redirect('back');
        } 
        if (req.body.oldpassword != req.user.password){
            req.flash('error', 'Type Correct password');
            return res.redirect('back');
        }  
        else{
            user.password=req.body.password;
            user.save();
            req.flash('success', 'Password change successfully');
            return res.redirect('back');
        }
    });



}




module.exports.update = async function(req, res){
   

    if(req.user.id == req.params.id){

        try{

            //let user = await User.findById(req.params.id);
            
            
            User.uploadedAvatar(req, res,async function(err){
                if (err) {console.log('*****Multer Error: ', err)}
                let user = await User.findByIdAndUpdate(req.params.id,req.body)
                
            
                //console.log(req.file);
                if (req.file){
                    //console.log("jj");
                    if (user.avatar){
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }

                   
                    // this is saving the path of the uploaded file into the avatar field in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                   
                }
                //console.log(user);
                user.save();
                let h=await H.findOne({Id:req.user.email});
                h.Name=req.body.name+"["+req.user.designation+"]";
                h.save();
                req.flash('success', "Updated");
                return res.redirect(`/users/profile/${req.user._id}`);
            });

        }catch(err){
            
            return res.redirect('back');
        }


    }else{
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }
}

module.exports.getupdate = async function(req, res){
    if(req.user.id == req.params.id){
        let user=await User.findById(req.params.id);

        
        
            return res.render('user_update', {
                title: "Update",
                profile_user: user
                
            });
       
    }else{
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }
}

// render the sign up page
module.exports.signUp = function(req, res){
    if (req.isAuthenticated()){
      

        
        
        return res.redirect(`/users/profile/${req.user.id}`);
        
    }


    return res.render('signup', {
        title: "Sign Up"
    })
}


// render the sign in page
module.exports.signIn =async function(req, res){

    if (req.isAuthenticated()){
        
       
      
       
        return res.redirect(`/users/profile/${req.user.id}`);
    }
    let user=await User.findOne({access:"admin"});
    var a=0;
    if(!user){
        a=1;
    }

    return res.render('signin', {
        title: "Sign In",
        pass:a
    })
}

//sign up admin only
module.exports.admin=async function(req,res,next){
    let user=await User.findOne({access:"admin"})
    
    if(!user){
    return  next();
    }
    else{
     return   res.redirect("/users/sign-in")
    }
}

// get the sign up data
module.exports.create = function(req, res){
    if (req.body.password != req.body.confirm_password){
        req.flash('error', 'Passwords do not match');
        return res.redirect('back');
    }

    
            User.create({name:req.body.name,
                email:req.body.email,
                password:req.body.password,
                designation:"Center head",
                access:"admin",
            under:[]}, function(err, user){
                if(err){req.flash('error', err); return}
                H.create({
                    Id: req.body.email,
                    Name:req.body.name+"["+user.designation+"]",
                    Parent:""
                });
                notinotification.create({
                    user:user.email
                    
                 });
                 chatnotification.create({
                    user:user.email
                    
                 }); 

                req.flash('success', 'Signed up successfully signed in to continue');
                return res.redirect('/users/sign-in');
            })
        

  
}


// sign in and create a session for the user
module.exports.createSession = function(req, res){
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/');
}

module.exports.destroySession = function(req, res){
    req.logout();
    req.flash('success', 'You have logged out!');


    return res.redirect('/users/sign-in');
}