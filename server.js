const app = require("./app");

const { connect } = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const { MONGO_URL } = process.env;
console.log(MONGO_URL);

connect(MONGO_URL, { dbName: "db-contacts" })
  .then(() => console.log("Database connection successful"))
  .catch((error) => console.error(error.message));

app.listen(5000, () => {
  console.log("Server running. Use our API on port: 5000");
});
