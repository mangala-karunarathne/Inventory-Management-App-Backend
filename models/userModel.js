const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add a email"],
      unique: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please Enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minLength: [6, "Password Must be upto 6 charactors"],
      // maxLength: [25, "Password Must be less than 25 charactors"],
    },
    photo: {
      type: String,
      required: [true, "Please add a photo"],
      default:
        "https://res.cloudinary.com/demo/image/twitter_name/BillClinton.jpg",
    },
    phone: {
      type: String,
      required: [true, "Please add a photo"],
      default: "+94 77 111 678 8",
    },
    bio: {
      type: String,
      required: [true, "Please add a photo"],
      default: "I am Mangala Karunarathne ASE at Blockstars Pvt Ltd",
      maxLength: [250, "Password Must be less than 250 charactors"],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
