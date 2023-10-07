require("dotenv").config();

const {
  MONGO_DB_USER,
  MONGO_DB_PASSWORD,
  MONGO_DB_PORT,
  MONGO_DB_DATABASE,
  SECRET_KEY,
  PASSWORD_MAIL,
  USERNAME_MAIL,
  BASE_URL
} = process.env;

if (!MONGO_DB_USER) {
  throw new Error("Please setup MONGO_DB_USER variable");
}

if (!MONGO_DB_PASSWORD) {
  throw new Error("Please setup MONGO_DB_PASSWORD variable");
}

if (!MONGO_DB_PORT) {
  throw new Error("Please setup MONGO_DB_PORT variable");
}

if (!MONGO_DB_DATABASE) {
  throw new Error("Please setup MONGO_DB_DATABASE variable");
}

if (!SECRET_KEY) {
  throw new Error("Please setup SECRET_KEY variable");
}

if (!USERNAME_MAIL) {
  throw new Error("Please setup USERNAME_MAIL variable");
}

if (!PASSWORD_MAIL) {
  throw new Error("Please setup PASSWORD_EMAIL variable");
}

if (!BASE_URL) {
  throw new Error("Please setup BASE_URL variable");
} 

module.exports = {
  MONGO_DB_USER,
  MONGO_DB_PASSWORD,
  MONGO_DB_PORT,
  MONGO_DB_DATABASE,
  SECRET_KEY,
  USERNAME_MAIL,
  PASSWORD_MAIL,
  BASE_URL
};
