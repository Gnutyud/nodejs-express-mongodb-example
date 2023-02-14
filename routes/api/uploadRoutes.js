const express = require("express");
const router = express.Router();
const upload = require("../../middlewares/multer");
const uploadController = require("../../controllers/uploadController");

router.route("/uploadphoto").post(upload.single('photo'), uploadController.uploadPhoto);

module.exports = router;