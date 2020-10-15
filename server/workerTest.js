const fs = require('fs');
const faker = require('faker');
const { Worker, isMainThread } = require('worker_threads');
const { performance } = require('perf_hooks');


if (isMainThread) {
  let workerOne = new Worker(__filename);
  let workerTwo = new Worker(__filename);
  let workerThree = new Worker(__filename);
  let workerFour = new Worker(__filename);
} else {
  const id = require('worker_threads').threadId

  const generateRecords = function(numRecords) {
    let records = [];
    let brands = [];
    let departments = [];

    for (let i = 0; i < numRecords / 10; i++) {
      brands.push(faker.company.companyName());
      departments.push(faker.commerce.department());
    }

    for (let i = 0; i < numRecords; i++) {
      records.push({
        title: faker.commerce.productName(),
        brand: brands[ Math.floor( Math.random() * brands.length ) ],
        department: departments[ Math.floor( Math.random() * departments.length ) ],
        price: Number(faker.commerce.price(0, 100)) - Math.ceil(Math.random() * 5) / 100,
        imageUrl: `https://twzkraus-fec-images.s3-us-west-1.amazonaws.com/target-images/${i % 50}.jpg`,
        productUrl: `/${i % 100 + 1}`
      });
    }
    return records;

  };
  let t1 = performance.now()
  const records = generateRecords(250);
  const recordsJSON = JSON.stringify(records);
  fs.writeFile(`../data/random-data-${id}.json`, recordsJSON, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      let t2 = performance.now()
      const timeTaken = t2 - t1;
      console.log(`worker ${id} took ${timeTaken} milliseconds to write ${records.length} records`)
    }
  });



}