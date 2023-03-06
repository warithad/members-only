const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username : {
        type : String,
        required: true,
        minLength: 2,
        maxLength: 25
    },
    pasword : {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50
    },
    is_member : {
        type: Boolean,
        default: false
    }
})

UserSchema.virtual('url').get(function(){
    return `/user/${this._id}`;
})

module.exports = mongoose.Model('User', UserSchema);