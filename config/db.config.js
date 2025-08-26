const mysql = require("mysql2");

try {
  const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER_NAME,
    password: process.env.PASSWORD,
    database: process.env.DB,
  });
  console.log("Connected to Database");
  module.exports = connection;
} catch (err) {
  console.log(err);
}