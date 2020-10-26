require('newrelic');
const app = require('./server.js');
const PORT = 3003;

app.listen(PORT, () => {
  console.log('running on port', PORT);
});
