const { body } = require("express-validator");

const registerValidationRules = () => [
  body("username").trim().isLength({ min: 6, max: 20 }).withMessage("Username must be 6-20 characters long.").isAlphanumeric().withMessage("Username must be alphanumeric."),

  body("phone")
    .matches(/^0[0-9]{9}$/)
    .withMessage("Phone number must be a valid Thai mobile number."),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long.")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter.")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter.")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number."),
];

const updateValidationRules = () => [
  body("username").trim().isLength({ min: 6, max: 20 }).withMessage("Username must be 6-20 characters long.").isAlphanumeric().withMessage("Username must be alphanumeric."),

  body("phone")
    .matches(/^0[0-9]{9}$/)
    .withMessage("Phone number must be a valid Thai mobile number."),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long.")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter.")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter.")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number."),
];

const loginValidationRules = () => [
  body("username").trim().isLength({ min: 6, max: 20 }).withMessage("Username must be 6-20 characters long.").isAlphanumeric().withMessage("Username must be alphanumeric."),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long.")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter.")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter.")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number."),
];

module.exports = { registerValidationRules, updateValidationRules, loginValidationRules };
