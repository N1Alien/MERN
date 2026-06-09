const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const carRoutes = require('./routes/api/car.routes');
const orderRoutes = require('./routes/api/order.routes');
const helmet = require('helmet');
const app = express();

/* MIDDLEWARE */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());

/* API ENDPOINTS */
app.use('/api', carRoutes);
app.use('/api', orderRoutes);

/* API ERROR PAGES */
app.use('/api', (req, res) => {
  res.status(404).send({ data: 'Not found...' });
});
// I leave this like that so it can be easly to check.(Im know that it should be  never revealed in real life)
// I also leave proper heroku secured code that works fine

mongoose.connect('mongodb+srv://slawomir:energy2000@cluster0.rqbyt.mongodb.net/ShopItemsDB?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

// process.env.NODE_ENV === 'production' ?
//   mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true }) :
//   mongoose.connect('mongodb://localhost:27017/ShopItemsDB', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.once('open', () => {
  console.log('Successfully connected to the database');
});
db.on('error', err => console.log('Error: ' + err));

/* REACT WEBSITE */
app.use(express.static(path.join(__dirname, '../build')));
app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

/* START SERVER */
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log('Server is running on port: ' + port);
});