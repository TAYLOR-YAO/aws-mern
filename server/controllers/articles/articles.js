const Article = require("../../models/Articles");
const slugify = require("slugify");
const formidable = require("formidable");
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
// const s3 = new AWS.S3({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION,
// });

exports.create = (req, res) => {
  const {
    nomUnique,
    descriptions,
    images,
    article,
    adresse,
    quartier,
    prix,
    region,
    categorie,
    rapportSocial,
    qty,
    deal,
    ville,
  } = req.body;
  const slug = slugify(nomUnique);
  const newArticle = new Article({
    nomUnique,
    slug,
    images,
    descriptions,
    article,
    adresse,
    prix,
    region,
    ville,
    quartier,
    categorie,
    rapportSocial,
    qty,
    deal,
  });
  newArticle.postePar = req.user._id;

  //   save to db
  newArticle.save((err, success) => {
    if (err) {
      console.log(err);
      res.status(400).json({
        error:
          "Vous ne pouvez pas dupliquer un article. modifiez les information",
      });
    }
    return res.json(success);
  });
};

exports.list = (req, res) => {
  Article.find({})
    .populate("postePar")
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: "Articles non trove",
        });
      }
      // console.log(data[0]);
      res.json(data);
    });
};

exports.read = (req, res) => {};

// exports.read = (req, res) => {
// const { slug } = req.params;
// let limit = req.body.limit ? parseInt(req.body.limit) : 10;
// let skip = req.body.skip ? parseInt(req.body.skip) : 0;
//
// Article.findOne({ slug })
// .populate('postedBy', '_id name username')
// .exec((err, category) => {
// if (err) {
// return res.status(400).json({
// error: 'Could not load category'
// });
// }
// res.json(category);
// Link.find({ categories: category })
// .populate('postedBy', '_id name username')
// .populate('categories', 'name')
// .sort({ createdAt: -1 })
// .limit(limit)
// .skip(skip)
// .exec((err, links) => {
// if (err) {
// return res.status(400).json({
// error: 'Could not load links of a category'
// });
// }
// res.json({ category, links });
// });
// });
// };

// exports.read = (req, res) => {
// const { slug } = req.params;
// let limit = req.body.limit ? parseInt(req.body.limit) : 10;
// let skip = req.body.skip ? parseInt(req.body.skip) : 0;
//
// Category.findOne({ slug })
// .populate('postedBy', '_id name username')
// .exec((err, category) => {
// if (err) {
// return res.status(400).json({
// error: 'Could not load category'
// });
// }
// res.json(category);
// Link.find({ categories: category })
// .populate('postedBy', '_id name username')
// .populate('categories', 'name')
// .sort({ createdAt: -1 })
// .limit(limit)
// .skip(skip)
// .exec((err, links) => {
// if (err) {
// return res.status(400).json({
// error: 'Could not load links of a category'
// });
// }
// res.json({ category, links });
// });
// });
// };
//

exports.update = (req, res) => {
  //
};

exports.remove = (req, res) => {
  //
};
