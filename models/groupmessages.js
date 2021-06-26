const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    
    user: {
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

const Message = mongoose.model('groupmessage', messageSchema);
module.exports = Message;