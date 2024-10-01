const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Assuming you're storing userId from Auth0
  products: [
    {
      productId: { type: Schema.Types.ObjectId, ref: 'Product',required:true },
      quantity: { type: Number, required: true, default: 1 }
    }
  ]
});

module.exports = mongoose.model('Cart', cartSchema);
