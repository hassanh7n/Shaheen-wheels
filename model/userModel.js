const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const UserModel = new mongoose.Schema({
    name : {
        type : String,
        required : [true, "Please provide your name"],
        maxlength : 20
    },
    email : {
        type : String,
        required : [true, "Please provide email address"],
        unique : true,
        validate : {
            validator : validator.isEmail,
            message : "Please provide valid email"
        }
    },
    password : {
        type : String,
        required : [true, "Please provide password"],
        minlength : 6
    },
    role: {
        type : String,
        enum : ["admin", "user"],
        default : "user"
    }
})



UserModel.pre('save', async function(){
    if(!this.isModified('password')) return ;
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
})


UserModel.methods.comparePassword = async function(candidatePassword){
    const isMatch = await bcryptjs.compare(candidatePassword, this.password);
    return isMatch
}

module.exports = mongoose.model('User', UserModel)