const User = require('../model/userModel');
const {StatusCodes} = require('http-status-codes');
const CustomErrors = require('../errors');
const {  
    attachCookiesToResponse,
    createTokenUser
} = require('../utils')

const register = async(req, res) => {
    const {name, email, password} = req.body;
    const isAlreadyExistedEmail = await User.findOne({email})
    if(isAlreadyExistedEmail){
        throw new CustomErrors.BadRequestError("Email with this address already exist")
    }
    const isFirstAccount = (await User.countDocuments({})) === 0;
    const role = isFirstAccount ? 'admin' : 'user';

    const user = await User.create({name, email, password, role});

    const tokenUser = createTokenUser(user)

    attachCookiesToResponse({
        res,
        user : tokenUser
    })
    res.status(StatusCodes.CREATED).json({
        user : tokenUser
    })
}

const LogIn = async(req, res) => {
    const {email, password} = req.body;
    if(!email || !password){
        throw new CustomErrors.BadRequestError("Please provide both value")
    }

    const user = await User.findOne({email});

    if(!user){
        throw new CustomErrors.BadRequestError("No Email with this address")
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if(!isPasswordCorrect){
        throw new CustomErrors.NotFoundError("Wrong password")
    }
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({
        res, 
        user : tokenUser
    })

    res.status(StatusCodes.OK).json({
        user : tokenUser
    })
}

const LogOut = async(req, res) => {
    res.cookie('token', 'logout', {
        httpOnly : true,
        expires : new Date(Date.now())
    })

    res.status(StatusCodes.OK).json({
        msg : 'User LogOut successfuly'
    })
} 



module.exports = {
    register,
    LogIn,
    LogOut
}