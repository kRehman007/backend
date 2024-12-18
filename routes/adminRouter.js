const express = require("express");
const router = express.Router();
const { adminForm } = require("../controllers/adminController");
const upload = require("../config/multer_config");

router.post("/courses", upload.single("image"), adminForm);

module.exports = router;
