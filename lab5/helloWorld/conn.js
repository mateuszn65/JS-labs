const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://mateusz:jslab@jslab.xv8bn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

let dbConnection;

module.exports = {
  connectToServer: (callback) => {
    client.connect(function (err, db) {
      if (err || !db) {
        return callback(err);
      }

      dbConnection = db.db('JSlab');
      console.log('Successfully connected to MongoDB.');

      return callback();
    });
  },

  getDb: () => {
    return dbConnection;
  },
};