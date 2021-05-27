const express = require("express");
const bodyParser = require("body-parser");
const db = require("./database/database");
const path = require("path");
const cors = require("cors");

var app = express();
app.use(cors());
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, "images")));
const userRoute = require("./routes/userRoute");
app.use(userRoute);
const PORT = process.env.PORT || 90;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
