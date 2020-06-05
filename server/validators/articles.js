const { check } = require("express-validator");

exports.articleCreateValidator = [
  check("article")
    .not()
    .isEmpty()
    .withMessage("Le nom de l'rticle est obligatoir"),
  check("images").not().isEmpty().withMessage("Les images sont obligatoir"),
  check("adresse").isLength({ min: 5 }).withMessage("L'adresse is obligatoir"),
];

exports.articleUpdateValidator = [
  check("article")
    .not()
    .isEmpty()
    .withMessage("Le nom de l'rticle est obligatoir"),
  check("adresse").isLength({ min: 5 }).withMessage("L'adresse is obligatoir"),
];
