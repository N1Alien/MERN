const express = require('express');
const router = express.Router();

const Cars = require('../../models/cars.model');

router.get('/cars',(req, res) => {
  // console.log(req.session)
  Cars.find()
    .then(car => res.json(car));
});

router.get('/car/:id', async (req, res) => {
  try {
    const result = await Cars
      .findById(req.params.id);
    if (!result) res.status(404).json({ post: 'Not found' });
    else res.json(result);
  }
  catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;