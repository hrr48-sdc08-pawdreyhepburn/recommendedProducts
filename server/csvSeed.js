const fs = require('fs');
const faker = require('faker');
const { Worker, isMainThread } = require('worker_threads');
const { performance } = require('perf_hooks');
// const v8 = require('v8');

// console.log(v8.getHeapStatistics());

if (isMainThread) {
  const columns = 'title, brand, department, price, imageUrl, productUrl\n'
  fs.writeFile('../data/random-data.csv', columns, (err) => {
    if (err) {
      console.log(err);
    } else {
      for (let i = 0; i < 5; i++) {
        new Worker(__filename)
      }
    }
  })


} else {
  const id = require('worker_threads').threadId
  const writeStream = fs.createWriteStream('../data/random-data.csv', {flags: 'a'});
  const generateRecords = function(numRecords) {
    let records = '';
    let brands = [];
    let departments = [];

    for (let i = 0; i < numRecords / 10; i++) {
      brands.push(faker.company.companyName());
      departments.push(faker.commerce.department());
    }

    for (let i = 0; i < numRecords; i++) {
      let dataPoint =
        `${faker.commerce.productName()}, ${brands[ Math.floor( Math.random() * brands.length ) ]}, ${departments[ Math.floor( Math.random() * departments.length ) ]}, ${Number(faker.commerce.price(0, 100)) - Math.ceil(Math.random() * 5) / 100}, https://twzkraus-fec-images.s3-us-west-1.amazonaws.com/target-images/${i % 50}.jpg, /${i % 100 + 1}\n`
        writeStream.write(dataPoint);
    }
  };

  let numOfRecords = 2000000;

  let t1 = performance.now();
  generateRecords(numOfRecords);
  let t2 = performance.now();

  console.log(`worker ${id} wrote ${numOfRecords} records in ${t2 - t1} milliseconds`);
}