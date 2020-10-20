const pool = require('./index.js');
const { performance } = require('perf_hooks')

pool.query('DROP TABLE IF EXISTS products')
  .then((results) => {
    console.log('products seeding kicked off')
    let t1 = performance.now()
    // create primary products table
    pool.query('CREATE TABLE products (id serial PRIMARY KEY, title VARCHAR(255) NOT NULL, price NUMERIC(5, 2) NOT NULL, image_url VARCHAR(255) NOT NULL, productURL VARCHAR(255) NOT NULL, dept_id INT NOT NULL, brand_id INT NOT NULL);')
    .then((results) => {
      // seed primary products table
      console.log('created products table');
      pool.query(`COPY products(title, brand_id, dept_id, price, image_url, producturl) from '${__dirname}/../data/random-data.csv' delimiter ',' csv header;`)
      .then((results) => {
        pool.query('ALTER TABLE products add foreign key (dept_id) references departments (id), add foreign key (brand_id) references brands (id)')
          .then((results) => {
            let t3 = performance.now();
            console.log(`Foreign key constraints finished ${t3 - t2} seconds after products load`)
          })
          .catch((err) => {
            console.log(err);
          })
        let t2 = performance.now();
        console.log(`Loaded ${results.rowCount} into products table in ${t2 - t1} ms`);
      })
    })
    .catch((err) => {
      console.log('error on products table seed: ', err);
    })
  })

pool.query('DROP TABLE IF EXISTS brands')
  .then((results) => {
    console.log('brand seeding kicked off')
    let t1 = performance.now();
    pool.query('CREATE TABLE brands (id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL);')
      .then((results) => {
        console.log('created brands table')
        // seed brand names table different delimiter since brands have commas in their name...
        pool.query(`COPY brands(name) from '${__dirname}/../data/brands.csv' delimiter '|' CSV;`)
        .then((results) => {
          // measure performances
          let t2 = performance.now();
          console.log(`Loaded ${results.rowCount} into brands table in ${t2 - t1} ms`);
        })
        .catch((err) => {
          console.log('err loading departments table: ', err);
        })
      })
      .catch((err) => {
        console.log('err loading brands table: ', err);
      })
  })
  .catch((err) => {
    console.log('err loading brands table: ', err);
  })

pool.query('DROP TABLE IF EXISTS departments')
  .then((results) => {
    console.log('department seeding kicked off')
    let t1 = performance.now();
    pool.query('CREATE TABLE departments (id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL);')
      .then((results) => {
      console.log('created departments table');
        // seed brand names table
        pool.query(`COPY departments(name) from '${__dirname}/../data/departments.csv' delimiter ',' CSV;`)
          .then((results) => {
            // measure performances
            let t2 = performance.now();
            console.log(`Loaded ${results.rowCount} into departments table in ${t2 - t1} ms`);
          })
          .catch((err) => {
            console.log('err loading departments table: ', err);
          })
      })
      .catch((err) => {
        console.log('err loading departments table: ', err);
      })
  })
  .catch((err) => {
    console.log('err loading departments table: ', err);
  })
