const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'name is required'] },
  picture: String,
  age: Number,
  team: String
});
module.exports = mongoose.model('Driver', driverSchema);
