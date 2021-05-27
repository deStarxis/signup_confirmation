const mongoose = require("mongoose");
const connectionURI = "127.0.0.1:27017";
mongoose
  .connect("mongodb://" + connectionURI + "/signup_confirmation", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log(`MongoDB connected to : ${connectionURI}`);
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });
