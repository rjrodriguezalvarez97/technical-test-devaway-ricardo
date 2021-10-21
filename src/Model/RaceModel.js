const mongoose = require('mongoose');

const raceSchema = new mongoose.Schema({
  name: String,
  laps: [
    {
      driver: { type: mongoose.Types.ObjectId, ref: 'Driver' },
      time: String
    }
  ],
  drivers: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Driver'
    }
  ]
});
module.exports = mongoose.model('Race', raceSchema);
