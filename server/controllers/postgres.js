const pool = require('../../db')
const { performance } = require('perf_hooks');


// commented out console logs for production
module.exports = {
  getAll: (req, res) => {
    const { id } = req.params;

    pool.query('SELECT t1.id, t1.price, t1.producturl, t1.image_url FROM products AS t1 INNER JOIN products AS t2 ON t2.dept_id = t1.dept_id WHERE t2.id=$1 LIMIT 35', [ id ])
      .then((results) => {
          res.send(results.rows);
        })
      .catch((err) => {
        console.log(err);
        res.send('error finding current id')
      })

  },
  insertProduct: (req, res) => {
    let t1 = performance.now();
    const { title, price, image_url, producturl, dept_id, brand_id } = req.body;
    const queryArgs = [ title, price, image_url, producturl, dept_id, brand_id ]
    pool.query('INSERT INTO products(title, price, image_url, producturl, dept_id, brand_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', queryArgs)
      .then((results) => {
        res.send('success!')
      })
      .catch((err) => {
        // console.log(err);
        res.send('err inserting new product into database');
      })
  },
  updateProduct: (req, res) => {
    let t1 = performance.now()
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
            let t2 = performance.now();
            // console.log(`update query took ${ t2 - t1 } ms`)
            res.send('successfully updated product')
          })
          .catch((err) => {
            // console.log(err);
            res.send('Product found, but could not update for some reason... double check the data you are sending')
          })

      })
      .catch((err) => {
        // console.log(err);
        res.send('error updating product. Are you sure it exists?')
      })
  },
  deleteProduct: (req, res) => {
    let t1 = performance.now();
    pool.query('DELETE FROM products WHERE id=$1', [req.params.id])
      .then((results) => {
        let t2 = performance.now()
        res.send('succesfully deleted')
        // console.log(`delete query completed in ${ t2 - t1 } ms`);
      })
      .catch((err) => {
        // console.log(err);
        res.send('Error deleting product; are you sure it exists?');
      })
  }
}