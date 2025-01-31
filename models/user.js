const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

let userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  currBal: {
    type: Number,
    default: 0,
  },
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
