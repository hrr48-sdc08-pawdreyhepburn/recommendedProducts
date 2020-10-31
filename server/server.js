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
import { ServerStyleSheet } from 'styled-components';


app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(compression());
app.use('/', express.static(path.join(__dirname, '..', 'client', 'dist')));
app.use('/products/*', express.static(path.join(__dirname, '..', 'client', 'dist')));

app.get('/products/:id', (req, res) => {
  const sheet = new ServerStyleSheet();
  const body = ReactDOMServer.renderToString(sheet.collectStyles(<App />));
  const styleTags = sheet.getStyleTags();
  sheet.seal();

  // const indexFile = path.resolve('./server/index.html');
  const html = `
  <!DOCTYPE html>
  <html>
    <head>${styleTags}</head>
    <body>
      <div id="RecommendedProducts">${body}</div>
      <script src="/bundle.js"></script>
    </body>
  </html>`

  res.send(html);
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
