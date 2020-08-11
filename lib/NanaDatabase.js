const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3");

let dir = path.join(__dirname, "../data");

if (!fs.existsSync(dir)) {
  console.log("No database directory found! Created one...");
  fs.mkdir(dir, (err) => {
    if (!err) console.log("Database directory created successfully.");
  });
}

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
