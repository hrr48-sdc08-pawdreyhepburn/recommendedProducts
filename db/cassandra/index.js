const cassandra = require('cassandra-driver');
const {performance} = require('perf_hooks');

const client = new cassandra.Client({
  contactPoints: ['127.0.0.1'],
  localDataCenter: 'datacenter1',
  keyspace: 'sdc',
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
