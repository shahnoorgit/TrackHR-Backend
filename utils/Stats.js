import Contacts from "../Model/Contacts.model.js";

export const report = async (req, res) => {
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
        contactedCount,
        contactedPercentage: contactedPercentageOverall,
        successfulCount,
        successfulPercentage: successfulPercentageOverall,
        notReceivedCount,
        notReceivedPercentage: notReceivedPercentageOverall,
      },
      thisWeek: {
        contactsThisWeek,
        contactedThisWeek,
        contactedPercentage: contactedPercentageThisWeek,
        successfulThisWeek,
        successfulPercentage: successfulPercentageThisWeek,
        notReceivedThisWeek,
        notReceivedPercentage: notReceivedPercentageThisWeek,
      },
      thisMonth: {
        contactsThisMonth,
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
