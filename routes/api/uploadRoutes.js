const express = require("express");
const router = express.Router();
const upload = require("../../middlewares/multer");
const uploadController = require("../../controllers/uploadController");

router.route("/image").post(upload.single('image'), uploadController.uploadImage);

module.exports = router;