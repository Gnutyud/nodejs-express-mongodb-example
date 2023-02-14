const mongoose = require("mongoose");

const UploadSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
});
const UploadModel = mongoose.model("Upload", UploadSchema);

module.exports = UploadModel;
