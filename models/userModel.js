const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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

// Encrypt Password before saving to DB
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
