const Product = require('../model/productModel');
const CustomError = require('../errors');
const {StatusCodes} = require('http-status-codes');



const getAllProducts = async(req, res) => {
    const products = await Product.find({})


    res.status(StatusCodes.OK).json({
        products
    })
}


const getSingleProduct = async(req, res) => {
    const {id : productId} = req.params;


    const product  = await Product.findOne({_id : productId});
    if(!product){
        throw new CustomError.NotFoundError(`No Wheels with this id : ${productId}`)
    }
    res.status(StatusCodes.OK).json({
        product
    })
}

const updateProduct = async(req, res) => {
    const {
        user: { userId },
        params: { id: productId },
      } = req

    const product = await Product.findOneAndUpdate(
        { _id: productId, user : userId },
         req.body,
        { runValidators : true,}
        )

    if(!product){
        throw new CustomError.NotFoundError(`No product with id : ${productId}`)
    }

    res.status(StatusCodes.OK).json({
        product
    })
}


const createProduct = async(req, res) => {
    req.body.user  = req.user.userId;
    const product = await Product.create(req.body) 
    res.status(StatusCodes.CREATED).json({
        product
    })
};


const deletProduct = async(req, res) => {
    const {
        user: { userId },
        params: { id: productId },
      } = req

      const product = await Product.findByIdAndRemove({
        _id: productId,
        user: userId,
      })
      if (!product) {
        throw new CustomError.NotFoundError(`No job with id ${productId}`)
      }
      res.status(StatusCodes.OK).send(`Success! Product deleted successfuly`)
}


module.exports = {
    getAllProducts,
    getSingleProduct,
    updateProduct,
    createProduct,
    deletProduct
}

