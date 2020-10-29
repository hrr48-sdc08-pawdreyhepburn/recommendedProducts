const express = require('express');
const app = express();
const compression = require('compression')

const path = require('path');
const axios = require('axios');
const cors = require('cors');
const { getAll, insertProduct, updateProduct, deleteProduct } = require('./controllers/postgres.js')


app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(compression());
app.use('/products/*', express.static(path.join(__dirname, '..', 'client', 'dist')));
app.use('/', express.static(path.join(__dirname, '..', 'client', 'dist')));


app.get('/loaderio-*', async (req, res) => {
  res.status(200).send(req.originalUrl.slice(1, -1));
});

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
