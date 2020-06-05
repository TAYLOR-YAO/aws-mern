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
  Article.find({}).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: "Articles non trove",
      });
    }
    res.json(data);
  });
};

exports.read = (req, res) => {
  //
};

exports.update = (req, res) => {
  //
};

exports.remove = (req, res) => {
  //
};
