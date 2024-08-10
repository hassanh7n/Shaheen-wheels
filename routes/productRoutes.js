const {
    getAllProducts,
    getSingleProduct,
    updateProduct,
    createProduct,
    deletProduct
} = require('../controllers/ProductControllers');
const {authenticateUser,
    authorizePermissions
    }    = require('../middleware/authentication')
const express = require('express');
const router = express.Router()

router.route('/').post([authenticateUser, authorizePermissions('admin', 'user')], createProduct);
router.route('/').get(getAllProducts);
router.route('/:id').get( getSingleProduct);
router.route('/:id').patch(authenticateUser, authorizePermissions('admin', 'user'), updateProduct);
router.route('/:id').delete(authenticateUser, authorizePermissions('admin', 'user'), deletProduct);



module.exports = router;