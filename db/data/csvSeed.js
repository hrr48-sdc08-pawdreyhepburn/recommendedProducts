const fs = require('fs');
const faker = require('faker');
const { Worker, isMainThread } = require('worker_threads');
const { performance } = require('perf_hooks');


if (isMainThread) {
  const columns = 'title,brand,department,price,imageUrl,productUrl\n'
  let brands = new Set();
  let departments = new Set();

  for (let i = 0; i < 50000 ; i++) {
    brands.add(faker.company.companyName());
    departments.add(faker.commerce.department());
  }

  brands = Array.from(brands);
  departments = Array.from(departments);
  fs.writeFile(`${__dirname}/brands.csv`, brands.join('\n'), (err, results) => {
    if (err) {
      console.log(`something went wrong with brands, ${err}`)
    } else {
      console.log(`brands got ${brands.length}`)
    }
  });

  fs.writeFile(`${__dirname}/departments.csv`, departments.join('\n'), (err, results) => {
    if (err) {
      console.log(`something went wrong with departments, ${err}`)
    } else {
      console.log(`departments got ${departments.length}`)
    }
  });

  fs.writeFile(`${__dirname}/random-data.csv`, columns, (err) => {
    if (err) {
      console.log(err);
    } else {
      for (let i = 0; i < 5; i++) {
        new Worker(__filename, {workerData: { departmentsLength: departments.length, brandsLength: brands.length}})
      }
    }
  })
} else {
  const id = require('worker_threads').threadId
  console.log(`worker ${id} up and running`)
  let t1 = performance.now();
  const { brandsLength, departmentsLength } = require('worker_threads').workerData;
  const writeStream = fs.createWriteStream(`${__dirname}/random-data.csv`, {flags: 'a'});
  const generateRecords = function(numRecords) {

    for (let i = 0; i < numRecords; i++) {
      writeStream.write(`${faker.commerce.productName()},${ Math.floor( Math.random() * brandsLength + 1 ) },${ Math.floor( Math.random() * departmentsLength + 1 ) },${Number(faker.commerce.price(0, 100)) - Math.ceil(Math.random() * 5) / 100},https://twzkraus-fec-images.s3-us-west-1.amazonaws.com/target-images/${i % 50}.jpg,/${i % 100 + 1}\n`);
    }
  };
  let numOfRecords = 2000000
  generateRecords(numOfRecords);
  let t2 = performance.now();
  console.log(`worker ${id} wrote ${numOfRecords} records in ${t2 - t1} milliseconds`);
}
