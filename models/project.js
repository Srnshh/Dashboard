const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const AVATAR_PATH = path.join('/uploads/pdfs');

const groupSchema = new mongoose.Schema({
   
    status: {
        type: String
        
    },
    title: {
        type: String
        
    },
    about: {
        type: String
        
    },
    pdf: {
        type: String
        
    },
    group: {
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
groupSchema.statics.uploadedAvatar = multer({storage:  storage}).single('pdf');
groupSchema.statics.avatarPath = AVATAR_PATH;

const Group = mongoose.model('Project', groupSchema);

module.exports = Group;