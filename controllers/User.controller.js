import generateTokenandsetCookie from "../utils/jwtToken.js";
import User from "../Model/User.model.js";
import bcrypt from "bcrypt";

export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username: username });
  if (!user) {
    return res.status(400).json({ error: "User does not exist" });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ error: "Password does not match" });
  }
  generateTokenandsetCookie(user._id, res);
  res.status(200).json({ user });
};

export const signInUser = async (req, res) => {
  const { username, password, confirmPassword } = req.body;
  if (password.length < 5) {
    return res
      .status(400)
      .json({ error: "Password must be at least 5 characters long" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  const user = await User.findOne({ username: username });

  if (user) {
    return res.status(400).json({ error: "User already exists" });
  }

  const salt = await bcrypt.genSalt(5);
  const HashedPassword = await bcrypt.hash(password, salt);
  const newUser = await User.create({
    username: username,
    password: HashedPassword,
    contacts: [],
  });
  await newUser.save();
  res.status(200).json({ newUser });
};

export const logoutUser = async (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({ message: "Successfully logged out" });
};
