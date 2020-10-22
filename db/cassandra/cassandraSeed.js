const client = require('./index.js');
const fs = require('fs');

// let readStream = fs.readFile(`${__dirname}/../../data/random-data.csv`, 'utf8', (err, results) => {
//   if (err) throw new Error
//   console.log(results)
// })


  console.log('kick off commencing')
  client.execute("DROP KEYSPACE IF EXISTS sdc")
  .then(() => {
    client.execute("CREATE KEYSPACE sdc WITH REPLICATION={'class': 'SimpleStrategy', 'replication_factor': 1};")
    .then(() => {
      client.execute('USE sdc')
        .then(() => {
          client.execute('CREATE TABLE products (id int, title varchar, brand_id int, dept_id smallint, price float, image_url varchar, product_url varchar, PRIMARY KEY ((dept_id), brand_id, price))')
            .then((res) => {
              client.execute(`COPY products (id, title, brand_id, dept_id, price, image_url, product_url) FROM '${__dirname}/../data/random-data.csv' WITH HEADER = TRUE;`)
                .then(() => {
                  client.execute('SELECT * FROM products')
                    .then((results) => {
                      console.log(results);
                    })
                })
                .catch((err) => {
                  console.log(err);
                })
            })
            .catch((err) => {
              console.log(err)
            })
        })
    })
    .catch((err) => {
      console.log(err);
    })

  })
  .catch((err) => {
    console.log('error connecting to the cassandra container');
    console.log(err);
  })

