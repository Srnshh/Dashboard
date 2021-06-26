const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
   
    user: {
        type: String,
        
    },
    dailylog:{
        type:Array
        
    }
    
}, {
    timestamps: true
});


const Group = mongoose.model('dailylog', groupSchema);

module.exports = Group;