const Image = require("../models/Image");

exports.uploadImage = async (req, res) => {
    try {
      const image = new Image({
        user_id: req.user.id, 
        path: req.file.path,
        frame: req.body.frame,
        logo_placement: req.body.logo_placement,
        text: req.body.text
      });
      await image.save();
      res.status(201).json({ message: "Image uploaded", data: image });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error", error: err.message });
    }
  };

  exports.getUserImages = async (req, res) => {
    try {
      const images = await Image.find({ user_id: req.user.id });
      res.status(200).json(images);
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };
  
