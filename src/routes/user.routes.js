const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { validate } = require("../middlewares/validate.middleware");
const { registerValidationRules, loginValidationRules, updateCreditValidationRules } = require("../validators/user.validator");

router.get("/", userController.getUsers);
router.post("/", registerValidationRules(), validate, userController.createUser);
router.put("/:user_id", registerValidationRules(), validate, userController.updateUser);
router.delete("/:user_id", userController.deleteUser);
router.put("/update-credit/:user_id", updateCreditValidationRules(), validate, userController.updateUserCredit);

router.post("/login", loginValidationRules(), validate, userController.login);

module.exports = router;
