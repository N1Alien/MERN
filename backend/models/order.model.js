const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  products: [{
    // id: { type: String, required: true },
    amount: { type: Number, required: true },
    mark: { type: String, required: true },
    model: { type: String, required: true },
    price: { type: String, required: true },
    engine: { type: String, required: true },
    request: { type: String },
  }],
  client: {
    name: { type: String, required: true },

    email: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: String, required: true },
  },
},
);

module.exports = mongoose.model('Order', orderSchema);