const express = require('express');
const path = require('path');
const axios = require('axios');
const cors = require('cors');
const app = express();
const { getAll, insertProduct, updateProduct, deleteProduct } = require('./controllers/cassandra.js')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'dist')));




app.post('/api/products', (req, res) => {
  insertProduct(req, res);
})

app.get('/api/products/:id', (req, res) => {
  getAll(req, res);
})

app.patch('/api/products/:id', (req, res) => {
  updateProduct(req, res);
})

app.delete('/api/products/:id', (req, res) => {
  deleteProduct(req, res);
})

module.exports = app;
