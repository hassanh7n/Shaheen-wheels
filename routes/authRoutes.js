const express = require('express');
const router = express.Router();

const  {
    register,
    LogIn,
    LogOut
} = require('../controllers/authController');

router.route('/register').post(register);
router.route('/login').post(LogIn);
router.route('/logout').get(LogOut);


module.exports = router;