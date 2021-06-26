const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
   
    user: {
        type: String,
        
    },
    allnoty:{
        type:Array,
        
    }
    
}, {
    timestamps: true
});


const Group = mongoose.model('chatnotification', groupSchema);

module.exports = Group;