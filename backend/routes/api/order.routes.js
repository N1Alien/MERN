const express = require('express');
const sanitize = require('mongo-sanitize');
const router = express.Router();
const Order = require('../../models/order.model');
const inputValidation = require('../../utils/inputValidation');

router.post('/order', async (req, res) => {

  try {
    const { name, email, address, city, zip } = req.body.client;
    const { request } = req.body.products;
    if (inputValidation(name, email, address, city, request)) {
      const newOrder = new Order({
        products: req.body.products,
        client: {
          name: sanitize(name),
          email: sanitize(email),
          address: sanitize(address),
          city: sanitize(city),
          zip: sanitize(zip),
          request: sanitize(request),
        },
      });
      await newOrder.save();
      res.json(newOrder);
    }
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

module.exports = router;