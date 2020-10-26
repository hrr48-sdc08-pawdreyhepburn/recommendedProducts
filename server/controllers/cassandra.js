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
}
