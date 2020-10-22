const client = require('../../db/cassandra');
const { performance } = require('perf_hooks');

module.exports = {
  getAll: (req, res) => {
    const query = `SELECT * FROM search_by_product WHERE id=${req.params.id}`;
    const t1 = performance.now();
    client.execute(query, [], {prepare: true})
      .then((results) => {
        const { brand_id, dept_id } = results.rows[0];
        client.execute(`SELECT * FROM products WHERE dept_id=${dept_id} AND brand_id>=${brand_id} LIMIT 35`)
          .then((results) => {
            const t2 = performance.now();
            console.log(`35 related products obtained in ${ t2 - t1 } ms`);
            res.send(results.rows);
          })
          .catch((err) => {
            console.log(err);
          })
      })
      .catch((err) => {
        console.log(err);
      })
  },
  insertProduct: (req, res) => {
    let t1 = performance.now();
    const { title, price, image_url, producturl, dept_id, brand_id } = req.body;
    const queryArgs = [ title, price, image_url, producturl, dept_id, brand_id ]
    client.execute(`INSERT INTO products (dept_id, brand_id, price, id, image_url, product_url, title) VALUES (${dept_id}, ${brand_id}, ${price}, 10000001, '${image_url}', '${producturl}', '${title}');`)
      .then((results) => {
        let t2 = performance.now();
        console.log(`query took ${ t2 - t1 } ms`)
        res.send('things are shaping up conrad');
      })
      .catch((err) => {
        console.log(err);
        res.send('whoops')
      })
    client.execute(`INSERT INTO search_by_product (brand_id, dept_id, id) VALUES (${brand_id}, ${dept_id}, 10000001)`)
    .then((results) => {
      console.log('success!!!')
    })
    .catch((err) => {
      console.log(err);
    })
  },
  updateProduct: (req, res) => {
    const t1 = performance.now();
    let { title, price, image_url, producturl, dept_id, brand_id } = req.body;

    client.execute(`SELECT * FROM search_by_product WHERE id=${req.params.id}`)
      .then((results) => {
        client.execute(`SELECT * FROM products WHERE dept_id=${results.rows[0].dept_id} AND brand_id=${results.rows[0].brand_id} AND id=${req.params.id} ALLOW FILTERING`)
          .then((results) => {

            const product = results.rows[0];
            console.log(results.rows[0])

            title = title || product.title;
            price = price || product.price;
            image_url = image_url || product.image_url;
            producturl = producturl || product.image_url;
            dept_id = dept_id || product.dept_id;
            brand_id = brand_id || product.brand_id;

            client.execute(`UPDATE products SET image_url='${image_url}', product_url='${producturl}', title='${title}' WHERE dept_id=${dept_id} AND price=${product.price} AND brand_id=${brand_id} AND id=${req.params.id};`)
              .then((results) => {
                const t2 = performance.now();
                console.log(`query took ${ t2 - t1 } ms`)
                res.send('things are shaping up conrad');
              })
              .catch((err) => {
                console.log(err);
                res.send('whoops')
              })
            client.execute(`UPDATE search_by_product SET brand_id=${brand_id}, dept_id=${dept_id} WHERE id=${req.params.id};`)
              .then((results) => {
                console.log('success!!!')
              })
              .catch((err) => {
                console.log(err);
              })
          })
          .catch((err) => {
            console.log(err);
          })
          })
          .catch((err) => {
            console.log(err);
          })

  }
}

