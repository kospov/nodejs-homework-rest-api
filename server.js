const app = require("./app");

const { connect } = require("mongoose");
require("dotenv").config();

const { MONGO_URL, PORT } = process.env;
const port = Number(PORT);

connect(MONGO_URL, { dbName: "db-contacts" })
  .then(() => {
    console.log("Database connection successful");

    app.listen(port, () => {
      console.log(`Server running. Use our API on port: ${port}`);
    });
  })
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
