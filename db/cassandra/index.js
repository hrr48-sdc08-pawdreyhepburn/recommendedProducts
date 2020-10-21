const cassandra = require('cassandra-driver');

const client = new cassandra.Client({
  contactPoints: ['127.0.0.1'],
  localDataCenter: 'datacenter1',
})

client.connect()
  .then((results) => {
    console.log('Connected to cassandra container');
    client.execute("DROP KEYSPACE IF EXISTS sdc")
    .then(() => {
      client.execute("CREATE KEYSPACE sdc WITH REPLICATION={'class': 'SimpleStrategy', 'replication_factor': 1};")
      .then(() => {
        client.execute('USE sdc')
          .then(() => {
            client.execute('CREATE TABLE products (test varchar, test2 varchar, PRIMARY KEY (test))')
              .then(() => {
                client.execute("INSERT INTO products (test, test2) VALUES ('hotdog', 'macaroni')")
                  .then(() => {
                    client.execute('SELECT * FROM products')
                      .then((results) => {
                        console.log(results);
                      })
                  })
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
    })
