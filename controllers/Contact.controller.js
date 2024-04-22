import Contacts from "../Model/Contacts.model.js";
import User from "../Model/User.model.js";

export const createContact = async (req, res) => {
  const { user_id, name, phoneNumber, email, action } = req.body;

  try {
    const newContact = await Contacts.create({
      name,
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
  const { contact_id, name, email, phoneNumber, action } = req.body;
  try {
    await Contacts.findByIdAndUpdate(
      { _id: contact_id },
      {
        name,
        email,
        phoneNumber,
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
    const mycontacts = await User.findById(_id).populate("contacts");
    res.status(200).json(mycontacts.contacts);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
