const mongoose = require('mongoose');
const db = mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = db;

