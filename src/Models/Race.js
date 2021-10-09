const mongoose = require('mongoose');

const raceSchema = new mongoose.Schema({
  laps: [
    {
      drivers: { type: mongoose.Types.ObjectId, ref: 'Driver' },
      time: Number
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
