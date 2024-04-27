import Contacts from "../Model/Contacts.model.js";
import User from "../Model/User.model.js";

export const createContact = async (req, res) => {
  const { user_id, name, phoneNumber, email, action, role } = req.body;

  try {
    const newContact = await Contacts.create({
      name,
      role,
      phoneNumber,
      email,
      action,
      contactDate: Date.now(),
      user: user_id,
    });
    const addToUser = await User.findOne({ _id: user_id });
    addToUser.contacts.push(newContact._id);
    await Promise.all([newContact.save(), addToUser.save()]);
    res.status(201).json(newContact);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const deleteContact = async (req, res) => {
  const { id } = req.body;
  try {
    const contact = await Contacts.findOne({ _id: id });
    const holder = await User.findOne({ _id: contact.user });
    holder.contacts.pull(id);
    await Promise.all([Contacts.deleteOne({ _id: id }), holder.save()]);

    res.status(200).json({ message: "Contact deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const updateContact = async (req, res) => {
  const { contact_id, action } = req.body;
  try {
    await Contacts.findByIdAndUpdate(
      { _id: contact_id },
      {
        action,
      }
    );
    res.status(200).json({ message: "Contact updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const fetchMyContacts = async (req, res) => {
  const { _id } = req.params;
  try {
    const mycontacts = await User.findById(_id).populate({
      path: "contacts",
      options: { sort: { updatedAt: -1 } }, // Sort contacts by updatedAt in descending order
    });
    res.status(200).json(mycontacts.contacts);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const fetchMyWeeksContacts = async (req, res) => {
  const { _id } = req.params;
  try {
    // Calculate the start date of the current week (Sunday)
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    // Calculate the end date of the current week (Saturday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);

    const mycontacts = await User.findById(_id).populate({
      path: "contacts",
      match: {
        createdAt: { $gte: startOfWeek, $lte: endOfWeek }, // Filter contacts for the current week
      },
      options: { sort: { createdAt: -1 } }, // Sort by createdAt field in descending order (latest first)
    });

    res.status(200).json(mycontacts.contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};
