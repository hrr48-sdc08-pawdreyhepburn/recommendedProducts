import fs from 'fs';
import express from 'express';
import compression from 'compression';
const app = express();
import path from 'path';
import axios from 'axios';
import cors from 'cors';
import { getAll, insertProduct, updateProduct, deleteProduct } from './controllers/postgres.js';
import 'regenerator-runtime';

import React from 'react';
import ReactDOMServer from 'react-dom/server';

import App from '../client/src/components/App.jsx';


app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(compression());
app.use('/', express.static(path.join(__dirname, '..', 'client', 'dist')));
app.use('/products/*', express.static(path.join(__dirname, '..', 'client', 'dist')));

app.get('/products/:id', (req, res) => {
  const ssrender = ReactDOMServer.renderToString(<App />)
  console.log(ssrender);
  const indexFile = path.resolve('./client/dist/index.html');

  fs.readFile(indexFile, 'utf8', (err, data) => {
    if (err) {
      console.log(err)
      res.status(500).send('couldnt read html file');
    }

    res.send(data.replace('<div id="RecommendedProducts"></div>', `<div id="RecommendedProducts">${ssrender}</div>`));
  })
})
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

export default app;
