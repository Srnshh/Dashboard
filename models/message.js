const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    
    user1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'

    },
    user2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    messages: {
        type:  Array,
        

    },
    chatroom:{
        type:  String,
    }
   
  
  
},{
    timestamps: true
});

const Message = mongoose.model('message', messageSchema);
module.exports = Message;