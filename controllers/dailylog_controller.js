const User = require('../models/user');
const fs = require('fs');
const path = require('path');

const Group = require('../models/group');
const H = require('../models/heirarchy');
const Post = require('../models/post');
const Project = require('../models/project');
const Comment = require('../models/comment');
const Groupmessages = require('../models/groupmessages');
const notinotification = require('../models/notinotification');
const ObjectID=require("mongodb").ObjectID;
const Dailylog = require('../models/dailylog');
const mongodb=require("mongodb");



module.exports.dailylog = async function(req, res){

    try{
        
      
    
        let D = await Dailylog.findOne({user:req.user.id});
        let d=new Date();
        let y=d.getFullYear();
        let m=d.getMonth()+1;
        if(m<10){
        var s=y+"-0"+m;
        }
        else{
        var s=y+"-"+m;
        }
        
        
        if(D){
        //     let ob =D.dailylog;
        //     D.dailylog=[];
        //     D.save();
        // //    
           let a= await Dailylog.updateOne(
                { _id: D._id },
                {
                  $push: {
                    dailylog: {
                       $each: [],
                       $sort: { sno: 1 }
                       
                      
                    }
                  }
                }
             )
           
             let object=[];
             let j= await Dailylog.findOne({user:req.user.id });
             for(let i=0;i<j.dailylog.length;i++){
                 if(j.dailylog[i].date.slice(0,7)==s){
                     object.push(j.dailylog[i]);
                 }
             }
            //Dailylog.aggregate({$unwind: '$dailylog.sno'},{$sort: {'dailylog.sno': 1}});
        return res.render('dailylog', {
            title: "Daily log",
            title2:s,
            pass:object
            
            
        });
    }
    else{
        let D = await Dailylog.create({user:req.user.id,dailylog:[]});
        return res.render('dailylog', {
            title: "Daily log",
            pass:[],
            title2:s,
            
            
        });

    }

    }catch(err){
        
        return res.render("errorpage",{title:"Error",pass:"404 Not Found"});
    }
   
}


module.exports.dsubmit = async function(req, res){

    try{
        let D = await Dailylog.findOne({user:req.user.id});
        var object={
            _id:new ObjectID(),
            content:req.body.content,
            date:req.body.date,
            sno:Date.parse(req.body.date)
        }
        D.dailylog.push(object);
        D.save();
      
    
        

        req.flash('success', 'Submitted');
        return res.redirect('back');
            
            
      

    }catch(err){
        
        return res.render("errorpage",{title:"Error",pass:"404 Not Found"});
    }
   
}

module.exports.checklog = async function(req, res){

    try{
        
      
    
        let D = await Dailylog.findOne({user:req.user.id});

        
        
        if(D){
        //     let ob =D.dailylog;
        //     D.dailylog=[];
        //     D.save();
        // //    
           let a= await Dailylog.updateOne(
                { _id: D._id },
                {
                  $push: {
                    dailylog: {
                       $each: [],
                       $sort: { sno: 1 }
                       
                      
                    }
                  }
                }
             )
             let object=[];
             let j= await Dailylog.findOne({user:req.user.id });
             for(let i=0;i<j.dailylog.length;i++){
                 if(j.dailylog[i].date.slice(0,7)==req.query.month){
                     object.push(j.dailylog[i]);
                 }
             }
            //Dailylog.aggregate({$unwind: '$dailylog.sno'},{$sort: {'dailylog.sno': 1}});
        return res.render('dailylog', {
            title: "Daily log",
            pass:object,
            title2:req.query.month
            
            
        });
    }
    else{
        let D = await Dailylog.create({user:req.user.id,dailylog:[]});
        return res.render('dailylog', {
            title: "Daily log",
            title2:req.query.month,
            pass:[]
            
            
        });

    }

    }catch(err){
        return res.render("errorpage",{title:"Error",pass:"404 Not Found"});
    }
   
}



module.exports.delete = async function(req, res){
    try{
        let D1 = await Dailylog.findOne({user:req.user.id});
        

        
        let D = await Dailylog.updateOne({_id:D1._id},{ $pull: {dailylog: { _id: mongodb.ObjectId(req.params.id) }}});

        
     
       //console.log(message1,message,req.params.id2,req.params.id);

       req.flash('success', 'deleted');
        return res.redirect('back');

    }catch(err){
        return res.render("errorpage",{title:"Error",pass:"404 Not Found"});
    }
  
}
   


module.exports.hisdailylog = async function(req, res){

    try{
        
      
        let u=await User.findOne({_id:req.params.id2});
        let D = await Dailylog.findOne({user:req.params.id2});
        let d=new Date();
        let y=d.getFullYear();
        let m=d.getMonth()+1;
        if(m<10){
        var s=y+"-0"+m;
        }
        else{
        var s=y+"-"+m;
        }
        
        
        if(D){
        //     let ob =D.dailylog;
        //     D.dailylog=[];
        //     D.save();
        // //    
           let a= await Dailylog.updateOne(
                { _id: D._id },
                {
                  $push: {
                    dailylog: {
                       $each: [],
                       $sort: { sno: 1 }
                       
                      
                    }
                  }
                }
             )
           
             let object=[];
             let j= await Dailylog.findOne({user:req.params.id2 });
             for(let i=0;i<j.dailylog.length;i++){
                 if(j.dailylog[i].date.slice(0,7)==s){
                     object.push(j.dailylog[i]);
                 }
             }
            //Dailylog.aggregate({$unwind: '$dailylog.sno'},{$sort: {'dailylog.sno': 1}});
        return res.render('hisdailylog', {
            title: "His Daily log",
            title2:s,
            pass:object,
            forform:req.params.id2,
            name:u.name
            
            
        });
    }
    else{
        let D = await Dailylog.create({user:req.params.id2,dailylog:[]});
        return res.render('hisdailylog', {
            title: "Daily log",
            pass:[],
            title2:s,
            forform:req.params.id2,
            name:u.name
            
            
        });

    }

    }catch(err){
        return res.render("errorpage",{title:"Error",pass:"404 Not Found"});
    }
   
}


module.exports.hischecklog = async function(req, res){

    try{
        
      
        let u=await User.findOne({_id:req.params.id2});
        let D = await Dailylog.findOne({user:req.params.id2});

        
        
        if(D){
        //     let ob =D.dailylog;
        //     D.dailylog=[];
        //     D.save();
        // //    
           let a= await Dailylog.updateOne(
                { _id: D._id },
                {
                  $push: {
                    dailylog: {
                       $each: [],
                       $sort: { sno: 1 }
                       
                      
                    }
                  }
                }
             )
             let object=[];
             let j= await Dailylog.findOne({user:req.params.id2 });
             for(let i=0;i<j.dailylog.length;i++){
                 if(j.dailylog[i].date.slice(0,7)==req.query.month){
                     object.push(j.dailylog[i]);
                 }
             }
            //Dailylog.aggregate({$unwind: '$dailylog.sno'},{$sort: {'dailylog.sno': 1}});
        return res.render('hisdailylog', {
            title: "His Daily log",
            pass:object,
            title2:req.query.month,
            forform:req.params.id2,
            name:u.name
            
            
        });
    }
    else{
        let D = await Dailylog.create({user:req.params.id2,dailylog:[]});
        return res.render('hisdailylog', {
            title: "Daily log",
            title2:req.query.month,
            pass:[],
            forform:req.params.id2,
            name:u.name
            
            
        });

    }

    }catch(err){
        return res.render("errorpage",{title:"Error",pass:"404 Not Found"});
    }
   
}