const { Pool } = require('pg')
const { performance } = require('perf_hooks');

const pool = new Pool({
  user: 'postgres',
  host: process.env.POSTGRES_URL,
  database: 'sdc',
  password: process.env.POSTGRES_PASSWORD,
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




