const mongoose = require('mongoose');

const hSchema = new mongoose.Schema({
    Id: {
        type: String,
        
        unique: true
    },
    Name: {
        type: String
        
    },
    Parent: {
        type: String
       
        
    }
    
});


const H = mongoose.model('heirarchy', hSchema);

module.exports = H;