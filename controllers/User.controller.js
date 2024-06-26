import generateTokenandsetCookie from "../utils/jwtToken.js";
import User from "../Model/User.model.js";
import bcrypt from "bcrypt";
import Contacts from "../Model/Contacts.model.js";

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
  res.status(200).json({
    username: user.username,
    contacts: user.contacts,
    _id: user._id,
  });
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
  res.status(200).json({
    username: newUser.username,
    contacts: newUser.contacts,
    _id: newUser._id,
  });
};

export const logoutUser = async (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({ message: "Successfully logged out" });
};

export const UserStats = async (req, res) => {
  const { user_id } = req.params;
  const startOfWeek = new Date();
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Start of the current week (Sunday)
  const endOfWeek = new Date();
  endOfWeek.setHours(23, 59, 59, 999);
  endOfWeek.setDate(endOfWeek.getDate() + (6 - endOfWeek.getDay())); // End of the current week (Saturday)

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const endOfMonth = new Date();
  endOfMonth.setMonth(endOfMonth.getMonth() + 1);
  endOfMonth.setDate(0);
  endOfMonth.setHours(23, 59, 59, 999);

  try {
    // Overall counts
    const allContactsCount = await Contacts.countDocuments({ user: user_id });
    const contactedCount = await Contacts.countDocuments({
      user: user_id,
      action: "contacted",
    });
    const successfulCount = await Contacts.countDocuments({
      user: user_id,
      action: "successful",
    });
    const notReceivedCount = await Contacts.countDocuments({
      user: user_id,
      action: "call_not_picked",
    });
    const pendingCount = await Contacts.countDocuments({
      user: user_id,
      action: "pending",
    });

    // Counts for this week
    const contactsThisWeek = await Contacts.countDocuments({
      user: user_id,
      contactDate: { $gte: startOfWeek, $lte: endOfWeek },
    });
    const contactedThisWeek = await Contacts.countDocuments({
      user: user_id,
      contactDate: { $gte: startOfWeek, $lte: endOfWeek },
      action: "contacted",
    });
    const successfulThisWeek = await Contacts.countDocuments({
      user: user_id,
      contactDate: { $gte: startOfWeek, $lte: endOfWeek },
      action: "successful",
    });
    const notReceivedThisWeek = await Contacts.countDocuments({
      user: user_id,
      contactDate: { $gte: startOfWeek, $lte: endOfWeek },
      action: "call_not_picked",
    });
    const pendingThisWeek = await Contacts.countDocuments({
      user: user_id,
      contactDate: { $gte: startOfWeek, $lte: endOfWeek },
      action: "pending",
    });

    // Counts for this month
    const contactsThisMonth = await Contacts.countDocuments({
      user: user_id,
      contactDate: { $gte: startOfMonth, $lte: endOfMonth },
    });
    const contactedThisMonth = await Contacts.countDocuments({
      user: user_id,
      contactDate: { $gte: startOfMonth, $lte: endOfMonth },
      action: "contacted",
    });
    const successfulThisMonth = await Contacts.countDocuments({
      user: user_id,
      contactDate: { $gte: startOfMonth, $lte: endOfMonth },
      action: "successful",
    });
    const notReceivedThisMonth = await Contacts.countDocuments({
      user: user_id,
      contactDate: { $gte: startOfMonth, $lte: endOfMonth },
      action: "call_not_picked",
    });
    const pendingThisMonth = await Contacts.countDocuments({
      user: user_id,
      contactDate: { $gte: startOfMonth, $lte: endOfMonth },
      action: "pending",
    });

    // Calculate percentages
    const contactedPercentageOverall = allContactsCount
      ? (contactedCount / allContactsCount) * 100
      : 0;
    const successfulPercentageOverall = allContactsCount
      ? (successfulCount / allContactsCount) * 100
      : 0;
    const notReceivedPercentageOverall = allContactsCount
      ? (notReceivedCount / allContactsCount) * 100
      : 0;

    const contactedPercentageThisWeek = contactsThisWeek
      ? (contactedThisWeek / contactsThisWeek) * 100
      : 0;
    const successfulPercentageThisWeek = contactsThisWeek
      ? (successfulThisWeek / contactsThisWeek) * 100
      : 0;
    const notReceivedPercentageThisWeek = contactsThisWeek
      ? (notReceivedThisWeek / contactsThisWeek) * 100
      : 0;

    const contactedPercentageThisMonth = contactsThisMonth
      ? (contactedThisMonth / contactsThisMonth) * 100
      : 0;
    const successfulPercentageThisMonth = contactsThisMonth
      ? (successfulThisMonth / contactsThisMonth) * 100
      : 0;
    const notReceivedPercentageThisMonth = contactsThisMonth
      ? (notReceivedThisMonth / contactsThisMonth) * 100
      : 0;

    res.json({
      overall: {
        allContactsCount,
        pendingCount,
        contactedCount,
        contactedPercentage: contactedPercentageOverall,
        successfulCount,
        successfulPercentage: successfulPercentageOverall,
        notReceivedCount,
        notReceivedPercentage: notReceivedPercentageOverall,
      },
      thisWeek: {
        contactsThisWeek,
        pendingThisWeek,
        contactedThisWeek,
        contactedPercentage: contactedPercentageThisWeek,
        successfulThisWeek,
        successfulPercentage: successfulPercentageThisWeek,
        notReceivedThisWeek,
        notReceivedPercentage: notReceivedPercentageThisWeek,
      },
      thisMonth: {
        contactsThisMonth,
        pendingThisMonth,
        contactedThisMonth,
        contactedPercentage: contactedPercentageThisMonth,
        successfulThisMonth,
        successfulPercentage: successfulPercentageThisMonth,
        notReceivedThisMonth,
        notReceivedPercentage: notReceivedPercentageThisMonth,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
