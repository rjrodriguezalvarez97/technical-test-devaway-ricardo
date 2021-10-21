const mongoose = require('mongoose');

class DatabaseConnection {
  static async connect(
    { server, database } = { server: 'localhost', database: 'Carl-Karts' }
  ) {
    try {
      await mongoose.connect(`mongodb://${server}/${database}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log(`Database connected on mongodb://${server}/${database}`);
    } catch (e) {
      console.log(e);
    }
  }

  static async disconnect() {
    return mongoose.disconnect();
  }

  static async dropDatabase() {
    return mongoose.connection.db.dropDatabase();
  }
}

module.exports = DatabaseConnection;
