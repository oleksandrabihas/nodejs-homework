const { default: mongoose } = require("mongoose");
const app = require("./app");

const {
  MONGO_DB_USER,
  MONGO_DB_PASSWORD,
  MONGO_DB_PORT,
  MONGO_DB_DATABASE
} = require("./constants/env");

app.listen(`${MONGO_DB_PORT}`, async () => {
  try {
await mongoose.connect(
        `mongodb+srv://${MONGO_DB_USER}:${MONGO_DB_PASSWORD}@cluster0.vhfugis.mongodb.net/${MONGO_DB_DATABASE}?retryWrites=true&w=majority`
    );
    console.log("Database connection successful");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
});
