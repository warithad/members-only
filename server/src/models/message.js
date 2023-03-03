const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    title : {
        type: String,
        minLength: 1,
        maxLength: 30,
        required: true
    },
    author : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    content : {
        type : String,
        maxLength: 100,
        required: true
    },
    timestamp : {
        type : Date,
        default : Date.now 
    }
})

MessageSchema.virtual('url').get(function (){
    return `/message/${this._id}`;
});

module.exports = mongoose.model('Message', MessageSchema);