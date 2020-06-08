const express = require("express");
const router = express.Router();

// import middlewares
const {
  requireSignin,
  authMiddleware,
  adminMiddleware,
  sellerMiddleware,
  readUser,
  updateRole,
} = require("../../controllers/auth/auth");

// import controllers
const { read } = require("../../controllers/auth/user");

// routes
router.get("/user", requireSignin, authMiddleware, read);
// router.get('/admin', adminMiddleware, read);
router.get("/admin", requireSignin, adminMiddleware, read);
router.get("/seller", requireSignin, sellerMiddleware, read);
router.post("/read/user", readUser);
router.put("/user/:role", requireSignin, adminMiddleware, updateRole);
module.exports = router;
