const pool = require('./index.js');

pool.query('drop table products')
  .then((results) => {
    console.log('he\'s heatin\' up')
    let t1 = performance.now()
    pool.query('create table if not exists products (id serial primary key, title varchar(255) not null, price numeric(5, 2) not null, image_url varchar(255) not null, productURL varchar(255) not null, dept_id int not null, brand_id int not null);')
    .then((results) => {
      pool.query(`COPY products(title, brand_id, dept_id, price, image_url, producturl) from '${__dirname}/../data/random-data.csv' delimiter ',' csv header;`)
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
  })
//  foreign key (dept_id) references departments (id)
// foreign key (brand_id) references brands (id)
