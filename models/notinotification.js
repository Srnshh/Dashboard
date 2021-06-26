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


const Group = mongoose.model('notinotification', groupSchema);

module.exports = Group;