const express = require('express');
const db = require('../db');
const path = require('path');
const axios = require('axios');
const cors = require('cors');
const app = express();
const { performance } = require('perf_hooks');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'dist')));

const formatName = (string) => {
  return string[0].toUpperCase() + string.split('').slice(1).join('');
};

// Legacy function works by having a master endroute ping three other routes that also search the db for related items. Need to optimize to pull this from the db in one pull. This is FOUR requests per request. That is going to stack up very, very quickly

app.get('/products/dept/:dept', (req, res) => {
  let formattedDept = formatName(req.params.dept);
  RecommendedItem.find({ department: formattedDept }, (err, results) => {
    res.json(results);
  });
});

app.get('/products/brand/:brandName', (req, res) => {
  // escape certain characters from request url
  let brandWords = req.params.brandName.split(/[,.\s-&amp]/);
  RecommendedItem.find({
    brand: {$regex: `^${brandWords.join('.*\s*')}$`, $options: 'i'}}, (err, results) => {
    res.json(results);
  });
});

app.get('/products/price/min=:minPrice&max=:maxPrice', (req, res) => {
  RecommendedItem.find({
    price: {
      $gte: req.params.minPrice || 0,
      $lte: req.params.maxPrice || 1000 }
    }, (err, results) => {
      res.json(results);
    }
  );
});

app.get('/products/id/:productId', async (req, res) => {
  RecommendedItem.findOne({ id: parseInt(req.params.productId) }, async (err, searchedProduct) => {
    let deptMatch = await axios.get(`http://localhost:3003/products/dept/${searchedProduct.department}`);
    let brandMatch = await axios.get(`http://localhost:3003/products/brand/${searchedProduct.brand}`);
    let priceMatch = await axios.get(`http://localhost:3003/products/price/min=${searchedProduct.price * 0.9}&max=${searchedProduct.price * 1.1}}`);

    const allResults = deptMatch.data.concat(brandMatch.data).concat(priceMatch.data);

    res.send(allResults);
  });

});

// Extended functionality

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
  let t1 = performance.now()
  db.query('SELECT * FROM products where id=$1', [req.params.id])
    .then((results) => {
      console.log(results);
      res.send(results.rows);
      let t2 = performance.now();
      console.log(`query took ${ t2 - t1 } ms`)
    })
    .catch((err) => {
      console.log(`error grabbing data ${err}`)
    })
})

app.put('/api/products/:id', (req, res) => {
  let infoToUpdate = req.body;
  RecommendedItem.update({id: req.params.id}, req.body)
    .then((results) => {
      res.json(results)
    })
    .catch((err) => {
      console.log(err);
      res.json('no dice');
    })
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
