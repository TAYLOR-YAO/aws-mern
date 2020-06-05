const express = require("express");
const router = express.Router();
const {register,
    registerActivated,login, 
    requireSignin,
    forgotPassword,
    resetPassword
} = require("../../controllers/auth/auth");
const {userRegisterValidator,
     userLoginValidator,
     forgotPasswordValidator,
     resetPasswordValidator
    } = require("../../validators/auth");
const {runValidation} = require("../../validators");
const db = require("../../models");


router.post("/register",userRegisterValidator,runValidation, register);
router.post("/activate-user", registerActivated);
router.post("/login",userLoginValidator, runValidation, login)
router.put('/forgot-password', forgotPasswordValidator, runValidation, forgotPassword);
router.put('/reset-password', resetPasswordValidator, runValidation, resetPassword);

// router.get('/secret', requireSignin, (req, res) => {
//     res.json({
//         data: 'This is secret page for logged in users only'
//     });
// });

module.exports = router;
