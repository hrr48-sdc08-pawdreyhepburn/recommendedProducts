const express = require('express');
const path = require('path');
const axios = require('axios');
const cors = require('cors');
const app = express();
const { getAll, updateProduct } = require('./controllers/postgres.js')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'dist')));




app.post('/api/products', (req, res) => {
  const { id, title, brand, department, price, imageUrl, productUrl } = req.body;

  RecommendedItem.create({ id, title, brand, department, price, imageUrl, productUrl })
    .then((results) => {
      res.send('success!', results);
    })
    .catch((err) => {
      res.send('err adding item. Ensure object fits API requirements');
    })
})

app.get('/api/products/:id', (req, res) => {
  getAll(req, res);
})

app.patch('/api/products/:id', (req, res) => {
  updateProduct(req, res);
})

app.delete('/api/products/:id', (req, res) => {
  RecommendedItem.deleteOne( {id: req.params.id} )
    .then((results) => {
      console.log(results);
      res.json('item deleted')
    })
    .catch((err) => {
      console.log(err);
      res.json('err deleting. Are you sure the item exists?')
    })
})

module.exports = app;
