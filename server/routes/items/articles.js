const express = require("express");
const router = express.Router();

// validators

const {
  articleCreateValidator,
  articleUpdateValidator,
} = require("../../validators/articles");

const { runValidation } = require("../../validators");

// controllers
const {
  requireSignin,
  adminMiddleware,
} = require("../../controllers/auth/auth");
const {
  create,
  list,
  read,
  update,
  remove,
} = require("../../controllers/articles/articles");
const { uploadImage } = require("../../controllers/uploads/article-images");
// routes
// router.post('/article' ,create);
// router.post('/article' , requireSignin, adminMiddleware, create);
router.post(
  "/article",
  articleCreateValidator,
  runValidation,
  requireSignin,
  adminMiddleware,
  create
);
router.get("/articles", list);
router.get("/article/:slug", read);
router.put(
  "/article/:slug",
  articleUpdateValidator,
  runValidation,
  requireSignin,
  adminMiddleware,
  create
);
router.delete("/article/:slug", requireSignin, adminMiddleware, remove);

// Image Upload Route
// uploadImage
router.post("/image", uploadImage);

module.exports = router;
