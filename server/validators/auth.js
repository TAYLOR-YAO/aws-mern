const { check } = require('express-validator');

exports.userRegisterValidator = [
    check('name')
        .not()
        .isEmpty()
        .withMessage('Le nom est obligatoir'),
    check('email')
        .isEmail()
        .withMessage('Vous devez donner un email valide'),
    check('password')
        .isLength({ min: 6 })
        .withMessage("Le mot de pass doit etre long d'au moins 6 caracters")
];

exports.userLoginValidator = [
   
    check('email')
        .isEmail()
        .withMessage('Vous devez donner un email valide'),
    check('password')
        .isLength({ min: 6 })
        .withMessage("Le mot de pass doit etre long d'au moins 6 caracters")
];

exports.forgotPasswordValidator = [
    check('email')
        .isEmail()
        .withMessage('Vous devez donner un email valide')
];

exports.resetPasswordValidator = [
    check('newPassword')
        .isLength({ min: 6 })
        .withMessage("Le mot de pass doit etre long d'au moins 6 caracters"),
    check('resetPasswordLink')
        .not()
        .isEmpty()
        .withMessage('Token expire')
];






