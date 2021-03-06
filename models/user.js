const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const AVATAR_PATH = path.join('/uploads/users/avatars');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    access: {
        type: String,
        
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String
        
       
    },
    employeeid: {
        type: String
        
       
    },
    employmenttype: {
        type: String
        
       
    },
    joiningdate: {
        type: String
        
       
    },
    currentpay: {
        type: String
        
       
    },
    fla: {
        type: String
        
       
    },
    sla: {
        type: String
        
       
    },
    skillsset: {
        type: String
        
       
    },
    group: {
        type: String
       
    },
    under:{
        type: Array
        
    },
    designation:{
        type: String,
        
        
    },
    phone: {
        type: String
        
    },
  
    dob: {
        type: String
        
    },
    city: {
        type: String
        
    },
    street: {
        type: String
        
    },
    state: {
        type: String
        
    },
    qualification: {
        type: String
        
    },
    avatar: {
        type: String
    }
}, {
    timestamps: true
});

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '..', AVATAR_PATH));
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now());
    }
  });


// static
userSchema.statics.uploadedAvatar = multer({storage:  storage}).single('avatar');
userSchema.statics.avatarPath = AVATAR_PATH;


const User = mongoose.model('User', userSchema);

module.exports = User;