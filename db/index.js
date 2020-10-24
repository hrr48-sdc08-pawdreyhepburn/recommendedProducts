const { Pool } = require('pg')
const { user, password, database } = require('./dbInfo');
const { performance } = require('perf_hooks');

const pool = new Pool({
  user,
  host: '44.237.178.98',
  database,
  password,
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




