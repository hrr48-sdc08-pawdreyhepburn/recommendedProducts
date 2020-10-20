const pool = require('../../db')
const { performance } = require('perf_hooks');

module.exports = {
  getAll: (req, res) => {
    let t1 = performance.now()
    const { id } = req.params;

    pool.query('SELECT brand_id, dept_id, price FROM products WHERE id=$1', [ id ])
      .then((results) => {
        const { brand_id, dept_id, price } = results.rows[0];

        pool.query('SELECT * FROM products WHERE (brand_id=$2 OR dept_id=$1) AND NOT id=$4 AND price BETWEEN ($3 * 0.1) and ($3 * 1.1) LIMIT 35;', [dept_id, brand_id, price, id])
        .then((results) => {
          res.send(results.rows);

          let t2 = performance.now();
          console.log(`query took ${ t2 - t1 } ms`)
        })
        .catch((err) => {
          console.log(`error grabbing data ${err}`)
        })
      })
      .catch((err) => {
        console.log(err);
        res.send('error finding current id')
      })

  },
  updateProduct: (req, res) => {
    let { title, price, image_url, producturl, dept_id, brand_id } = req.body;

    pool.query('SELECT * FROM products WHERE id=$1', [req.params.id])
      .then((results) => {
        const rows = results.rows[0];

        title = title || rows.title;
        price = price|| rows.price;
        image_url = image_url || rows.image_url;
        producturl = producturl || rows.producturl;
        dept_id = dept_id || rows.dept_id;
        brand_id = brand_id || rows.brand_id;
        const queryArgs = [ title, price, image_url, producturl, dept_id, brand_id, req.params.id ]
        pool.query('UPDATE products SET (title, price, image_url, producturl, dept_id, brand_id) = ($1, $2, $3, $4, $5, $6) WHERE id=$7', queryArgs)
          .then((results) => {
            console.log(results);
          })
          .then(() => {
            pool.query('SELECT * FROM products WHERE id=$1', [req.params.id])
              .then((results) => {
                res.send(results.rows[0]);
              })
          })
      })
  }
}