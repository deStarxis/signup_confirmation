const mongoose = require("mongoose");
const moment = require("moment-timezone");
const dateKathmandu = moment().tz("Asia/Kathmandu").format();
const user = mongoose.model("user", {
  FirstName: {
    type: String,
    required: true,
  },
  LastName: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
    unique: true,
  },
  Password: {
    type: String,
    required: true,
  },
  Status: {
    type: String,
    enum: ["NotVerified", "Verified"],
    default: "NotVerified",
  },
  ConfirmationCode: {
    type: String,
    unique: true,
  },
  CreatedAt: {
    type: Date,
    default: Date.now(dateKathmandu),
  },
});
module.exports = user;
