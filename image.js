const router = require("express").Router();
const multer = require("multer");
const verifyToken = require("../middleware/auth");
const { uploadImage } = require("../controllers/imageController");
const { getUserImages } = require("../controllers/imageController");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    }
  });

const upload = multer({ storage });

router.post(
  "/upload",
  verifyToken ,
  upload.single("image"), 
  uploadImage
);

router.get(
  "/user",
  verifyToken, 
  getUserImages
);

router.patch(
  "/:id/update", 
  verifyToken, 
  async (req, res) => {
    try {
      const image = await Image.findOneAndUpdate(
        { _id: req.params.id, user_id: req.user.id },
        {
          frame: req.body.frame,
          text: req.body.text
        },
        { new: true }
      );
      if (!image) return res.status(404).json({ message: "Image not found or access denied" });
      res.status(200).json(image);
    } catch (err) {
      res.status(500).json({ message: "Update failed", error: err.message });
    }
  });

  router.post("/share", verifyToken, async (req, res) => {
    const { imageId, platform } = req.body;
    // Mock response
    res.json({
      message: `Image ${imageId} shared to ${platform} (mocked)`
    });
  });

module.exports = router;
