const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const { verifyJWT } = require("../../middlewares/verifyJWT");

router.route('/')
  .get(userController.getAllUsers)
  .patch(verifyJWT, userController.updateUser)
  .delete(verifyJWT, userController.deleteUser);

  router.route("/:username").get(userController.getProfile);

module.exports = router;

