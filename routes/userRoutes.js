const express = require('express');
const router = express.Router();

const {authenticateUser,
    authorizePermissions
    }    = require('../middleware/authentication')
const {
    getAllUser,
    getSingleUser,
    updateUser,
    updateUserPassword,
    showMe
} = require('../controllers/userControllers');


router.route('/').get(authenticateUser, authorizePermissions('admin'), getAllUser);
router.route('/showMe').get(authenticateUser, showMe);
router.route('/:id').get(authenticateUser, getSingleUser);
router.route('/:id').patch(authenticateUser, updateUser);
router.route('/password/:id').patch(authenticateUser, updateUserPassword);




module.exports = router;