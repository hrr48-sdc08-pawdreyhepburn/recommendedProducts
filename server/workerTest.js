const fs = require('fs');
const faker = require('faker');
const { Worker, isMainThread } = require('worker_threads');
const { performance } = require('perf_hooks');
const v8 = require('v8');

// console.log(v8.getHeapStatistics());

if (isMainThread) {
  const columns = 'title, brand, department, price, imageUrl, productUrl\n'
  fs.writeFile('../data/random-data.csv', columns, (err) => {
    if (err) {
      console.log(err);
    } else {
      let workerOne = new Worker(__filename);
      let workerTwo = new Worker(__filename);
      let workerThree = new Worker(__filename);
      let workerFour = new Worker(__filename);
    }
  })


} else {
  const id = require('worker_threads').threadId

  const generateRecords = function(numRecords) {
    let records = '';
    let brands = [];
    let departments = [];

    for (let i = 0; i < numRecords / 10; i++) {
      brands.push(faker.company.companyName());
      departments.push(faker.commerce.department());
    }

    for (let i = 0; i < numRecords; i++) {
      records +=
        `${faker.commerce.productName()}, ${brands[ Math.floor( Math.random() * brands.length ) ]}, ${departments[ Math.floor( Math.random() * departments.length ) ]}, ${Number(faker.commerce.price(0, 100)) - Math.ceil(Math.random() * 5) / 100}, https://twzkraus-fec-images.s3-us-west-1.amazonaws.com/target-images/${i % 50}.jpg, /${i % 100 + 1}\n`
    }

    return records

  };
  let t1 = performance.now()
  let records = generateRecords(1250000);
  fs.appendFile(`../data/random-data.csv`, records, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      records = generateRecords(1250000);
      fs.appendFile(`../data/random-data.csv`, records, (err, results) => {
        if (err) {
          console.log(err);
        } else {
          let t2 = performance.now()
          const timeTaken = t2 - t1;
          console.log(`worker ${id} took ${timeTaken} milliseconds to write 2,500,000 records`)
          process.exit();
        };
      });
    }
  });



}