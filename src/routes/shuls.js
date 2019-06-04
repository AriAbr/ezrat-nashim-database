const express = require("express");
const router = express.Router();
const validation = require("./validation");
const helper = require("../auth/helpers");

const shulController = require("../controllers/shulController");

router.get("/shuls", shulController.index);

router.get("/shuls/new/select_city", shulController.newSelectCity);

router.get("/shuls/new/shul_details", shulController.newShulForm);

router.post("/shuls/create",
  helper.ensureAuthenticated,
  validation.validateShuls,
  shulController.create);

module.exports = router;
