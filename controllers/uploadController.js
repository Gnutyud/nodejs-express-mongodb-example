const Upload = require("../models/Upload");
const fs = require("fs");
const asyncHandler = require("express-async-handler");

// @desc upload file
// @route POST /files/uploadphoto
// @access Private
const uploadPhoto = asyncHandler(async (req, res, next) => {
  const files = req.file;
  if (!files) {
    const error = new Error("Please choose files");
    error.httpStatusCode = 400;
    return next(error);
  }

  // create object to store data in the collection
  let finalImg = {
    image: files.filename,
  };

  let newUpload = await Upload.create(finalImg);
  if (newUpload) {
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT}`
    res.status(200).json({ url: `${baseUrl}/uploads/${newUpload.image}` });
  } else {
    res.status(400).json({ message: "Invalid file upload data received" });
  }
});

module.exports = { uploadPhoto };
