const sqlite3 = require("sqlite3");

class NanaDatabase {
  constructor(client) {
    this.client = client;
    this.db = new sqlite3.Database("./data/database.sqlite3", err => {
      if (err) {
        console.log("Could not connect to database", err);
      } else {
        console.log("Connected to database.");
      }
    });
  }
}

module.exports = NanaDatabase;
