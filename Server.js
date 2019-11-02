const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const config = require("config");
const test = require("./config/production.json").mongoURI;
const test2 = require("./config/default.json").mongoURI;
const bodyParser = require("body-parser");
const fs = require("fs");
// const folder = require("./app/");
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// fs.readdir(folder, (err, files) => {
//   files.forEach(file => console.log(file));
// });

console.log(`\n\n PRODUCTION KEY:`, test, "\nLOCAL KEY:", test2, "\n\n");

app.use(cors());

const PORT = process.env.PORT || 5000;

try {
  // Connect Database
  // IMPORT DATABASE CONFIG
  console.log("Before Running test");
  const db = config.get("mongoURI");

  const connectDB = () => {
    return mongoose
      .connect(db, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
      })
      .then(console.log("Mongo Connected"))
      .catch(error => console.error(error.message));
  };

  connectDB();
} catch (error) {
  console.log("!!!!!!!THIS IS A CONNECTION ERROR: ", error.message);
}

// API ENDPOINTS
app.use(`/api/users`, require("./ROUTES/Users"));
app.use(`/api/auth`, require("./ROUTES/Auth"));
app.use(`/api/contacts`, require("./ROUTES/Contacts"));

const publicPath = path.join(__dirname, "client/build");
console.log(publicPath);

try {
  if (process.env.NODE_ENV === "production") {
    //Set static folder
    app.use(express.static("client/build"));

    // If any other routes are hit, load the index.html file inside the __dirname/client/build folder
    app.get("*", (req, res) =>
      res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
    );
  }
} catch (err) {
  console.log(err);
}
// Serve Static Assets In Production

app.listen(PORT, () => console.log(`Server started on ${PORT}`));
