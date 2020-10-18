const { Pool } = require('pg')
const { user, password, database } = require('./dbInfo');
const { performance } = require('perf_hooks');

const pool = new Pool({
  user,
  host: 'localhost',
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
//  foreign key (dept_id) references departments (id)
// foreign key (brand_id) references brands (id)
console.log('he\'s heatin\' up')
let t1 = performance.now()
module.exports.query('create table if not exists products (id serial primary key, title varchar(255) not null, price numeric(5, 2) not null, image_url varchar(255) not null, productURL varchar(255) not null, dept_id int not null, brand_id int not null);')
  .then((results) => {
    module.exports.query(`COPY products(title, brand_id, dept_id, price, image_url, producturl) from '${__dirname}/../data/random-data.csv' delimiter ',' csv header;`)
  .then((results) => {
    let t2 = performance.now();
    console.log(`HE\'S ON FIRE! ${results} in ${t2 - t1} ms`);
  })
  .catch((err) => {
    console.log(`Error loading data: ${err}`);
  })
  })
  .catch((err) => {
    console.log(err);
  })


