const mongoose = require('mongoose');

const raceSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'name is required'] },
  laps: [
    {
      driver: {
        type: mongoose.Types.ObjectId,
        ref: 'Driver',
        get: (v) => v.toString(),
        required: [true, 'driver is required']
      },
      time: { type: String, required: [true, 'time is required'] }
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
