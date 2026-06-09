const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  mark: { type: String, required: true },
  model: { type: String, required: true },
  price: { type: String, required: true },
  year: { type: String, required: true },
  color: { type: String, required: true },
  engine: { type: String, required: true },
  text: { type: String, required: true },
});

module.exports = mongoose.model('Car', productSchema); 