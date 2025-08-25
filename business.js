const router = require("express").Router();
const verifyToken = require("../middleware/auth");
const checkRole = require("../middleware/role");
const { getAllBusiness } = require("../controllers/businessController");
const { addBusiness } = require("../controllers/businessController");

router.post(
    "/add", 
    addBusiness
);
router.get(
    "/all", 
    verifyToken, 
    checkRole("admin"), 
    getAllBusiness
);

module.exports = router;
