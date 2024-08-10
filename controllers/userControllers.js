const User = require('../model/userModel');
const {StatusCodes} = require('http-status-codes');
const CustomError = require('../errors');
const {  
    attachCookiesToResponse,
    createTokenUser
} = require('../utils');

const getAllUser = async(req, res) => {
    
    const user = await User.find({});

    res.send(StatusCodes.OK).json({
        user
    })
}

const getSingleUser = async(req, res) => {
    const {id : userId} = req.params;

    const user = await User.findOne({_id : userId});

    if(!user){
        throw new CustomError.NotFoundError(`No user with this id : ${userId}`)
    }

    res.status(StatusCodes.OK).json({
        user
    })
}


const updateUser = async(req, res) => {
    
    const {email, name} = req.body;
    if(!email || !name){
        throw new CustomError.BadRequestError("Please provide both values")
    }
    const user = await User.findOne({_id : req.user.userId});

    user.email = email;
    user.name = name;

    await user.save()

    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({res, user : tokenUser})

    res.status(StatusCodes.OK).json({
        user : tokenUser
    })

}


const updateUserPassword =async(req, res) => {
    const {oldPassword , newPassword} = req.body;
    if(!newPassword || !oldPassword){
        throw new CustomError.BadRequestError("Please provide both values")
    }

    const user = await User.findOne({_id : req.user.userId});

    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if(!isPasswordCorrect){
        throw new CustomError.UnauthenticatedError("Invalid credentails")
    }
    user.password = newPassword;
    await user.save()
    res.status(StatusCodes.OK).json({
        msg : 'Success! Password changed successfuly'
    })
}




const showMe = async(req, res) => {
    res.status(StatusCodes.OK).json({
        user : req.user
    })
}



module.exports = {
    getAllUser,
    getSingleUser,
    updateUser,
    updateUserPassword,
    showMe
}