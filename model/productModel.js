const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        trim: true,
        required: [true, 'Please provide product name'],
        maxlength: [100, 'Name can not be more than 100 characters'],
      },
      price: {
        type: Number,
        required: [true, 'Please provide product price'],
        default: 0,
      },
      description: {
        type: String,
        required: [true, 'Please provide product description'],
        maxlength: [1000, 'Description can not be more than 1000 characters'],
      },
      image: {
        type: String,
        default: '/uploads/example.jpeg',
      },
      category: {
        type: String,
        required: [true, 'Please provide product category'],
        enum: ['Car', 'Motorbike', 'cycle'],
      },
      company: {
        type: String,
        required: [true, 'Please provide company'],
        enum: {
          values: ['Toyota', 'Honda', 'Suzuki'],
          message: '{VALUE} is not supported',
        },
      },
      colors: {
        type: [String],
        default: ['#222'],
        required: true,
      },
      user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    },
    { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
  );

  productSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'product',
    justOne: false,
  });
  
  productSchema.pre('remove', async function (next) {
    await this.model('Review').deleteMany({ product: this._id });
  });


module.exports = mongoose.model('Product', productSchema);