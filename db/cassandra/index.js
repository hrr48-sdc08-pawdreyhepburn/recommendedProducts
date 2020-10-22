const cassandra = require('cassandra-driver');
const {performance} = require('perf_hooks');

const client = new cassandra.Client({
  contactPoints: ['127.0.0.1'],
  localDataCenter: 'datacenter1',
  keyspace: 'sdc',
})

let t1 = performance.now();
client.execute('SELECT * FROM search_by_product WHERE id=9999999')
  .then((results) => {
    const { brand_id, dept_id } = results.rows[0];
    client.execute(`SELECT * FROM products WHERE dept_id=${dept_id} AND brand_id>=${brand_id} LIMIT 35`)
      .then((results) => {
        console.log(results);
        let t2 = performance.now();
        console.log(t2 - t1);
      })
      .catch((err) => {
        console.log(err);
      })

  })
  .catch((err) => {
    console.log(err);
  })

module.exports = {
  // basic query structure for promises
  execute: (text, params) => {
    return new Promise((resolve, reject) => {
      client.execute(text, params)
        .then((results) => {
          resolve(results);
        })
        .catch((err) => {
          reject(err);
        })
    })
  }
}
