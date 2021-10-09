const mongoose = require('mongoose');

class DatabaseConnection {
  static connect(server = 'localhost', database = 'Carl-Karts') {
    mongoose
      .connect(`mongodb://${server}/${database}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .then(() =>
        console.log(`Database connected on mongodb://${server}/${database}`)
      )
      .catch((e) => console.log(e));
  }
}

module.exports = DatabaseConnection;
