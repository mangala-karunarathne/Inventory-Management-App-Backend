const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  // validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill in all required fields");
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error("Password should contain at least 6 charactors");
  }

  //  Check if user email already exist
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("Email has alredy been registered");
  }

  // Create new User
  const user = await User.create({
    name,
    email,
    password,
  });

  // Generate Token
  const token = generateToken(user._id);

  // Register User

  // Send HTTP-only cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    sameSite: "none",
    secure: true,
  });

  if (user) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(201).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid Use Data");
  }
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please add both email and Password");
  }

  // Check if user exists
  const user = await User.findOne({ email });
  
  if (!user) {
    res.status(400);
    throw new Error("User Doesn't Exist, Please Signup");
  }

  // User Exists, check if password is correct or not
const passwordIsCorrect = await bcrypt.compare(password, user.password)

 // Generate Token
 const token = generateToken(user._id);

 // Register User

 // Send HTTP-only cookie
 res.cookie("token", token, {
   path: "/",
   httpOnly: true,
   expires: new Date(Date.now() + 1000 * 86400), // 1 day
   sameSite: "none",
   secure: true,
 });

if (user && passwordIsCorrect) {
  const { _id, name, email, photo, phone, bio } = user;
    res.status(200).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
      token,
    });
} else {
  res.status(400);
  throw new Error("Invalid email or Password");
}

});

// Logout User
const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0), // Once logout session cookie expires - MK
    sameSite: "none",
    secure: true,
  });
  return res.status(200).json({ message: "Successfully Logged Out"})

});

module.exports = {
  registerUser,
  loginUser,
  logout,
};
