const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: String,
  picture: String,
  age: Number,
  team: String
});
module.exports = mongoose.model('Driver', driverSchema);
