const Business = require("../models/Business");

exports.addBusiness = async (req, res) => {
  const business = new Business(req.body);
  await business.save();
  res.status(201).json({ message: "Business added" });
};

exports.getAllBusiness = async (req, res) => {
    try {
      const all = await Business.find();
      res.status(200).json(all);
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };
