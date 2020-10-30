const { Pool } = require('pg')
const { performance } = require('perf_hooks');

const pool = new Pool({
  user: 'postgres',
  host: '44.242.53.217',
  database: 'sdc',
  password: 'Gohan123',
  port: 5432,
})

module.exports = {
  // basic query structure for promises
  query: (text, params) => {
    return new Promise((resolve, reject) => {
      pool.query(text, params)
        .then((results) => {
          resolve(results);
        })
        .catch((err) => {
          reject(err);
        })
    })
  }
}




