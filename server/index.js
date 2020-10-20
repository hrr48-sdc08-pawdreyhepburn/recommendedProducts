const app = require('./postgresServer.js');
const PORT = 3003;

app.listen(PORT, () => {
  console.log('running on port', PORT);
});
