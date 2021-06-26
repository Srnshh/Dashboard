const mongoose = require('mongoose');


const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    postdate: {
        type: String,
        
    },
    startdate: {
        type: String,
        
    },
    status: {
        type: String,
        
    },
    enddate: {
        type: String,
        
    },
    completedon: {
        type: String,
        
    },
    tasksuccess: {
        type: String,
        
    },
    user1: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'User'

    },
    user2: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'User'

    },
    // include the array of ids of all comments in this post schema itself
    comments: [
        {
            type:  mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
},


{
    timestamps: true
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;