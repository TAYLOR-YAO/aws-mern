const Article = require("../../models/Articles");
const slugify = require("slugify");
// const formidable = require("formidable");
const AWS = require("aws-sdk");
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

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
          "Vous ne pouvez pas dupliquer un article. Modifiez les information",
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
          error: "Articles non trové",
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
// }

exports.update = (req, res) => {
  const { slug } = req.params;
  const { updatedArticle } = req.body;
  const {
    nomUnique,
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
  } = updatedArticle;

  Article.findOneAndUpdate(
    { slug },
    {
      nomUnique,
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
    },
    { new: true }
  ).exec((err, updated) => {
    if (err) {
      return res.status(400).json({
        error: "Article introuvé pour modification",
      });
    }
    // console.log("UPDATED", updated);
    res.json(updated);
  });
};

exports.remove = (req, res) => {
  const { slug } = req.params;
  Article.findOneAndRemove({ slug }).exec((err, data) => {
    // Article.findOne({ slug }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error:
          "Nous ne pouvons pas supprimer cet article. Contacter votre administrateur",
      });
    }
    // remove the existing images from s3 before uploading new/updated one
    const obj = data.images[0].key;
    console.log("OBJ: ", obj);

    data.images.forEach((image) => {
      const deleteParams = {
        Bucket: "immo-togo",
        Key: `${image.key}`,
      };
      s3.deleteObject(deleteParams, function (err, data) {
        if (err) console.log("S3 DELETE ERROR DUING", err);
        else console.log("S3 DELETED DURING", data); // deleted
      });
    });

    res.json({
      message: "Article supprimé avec succès",
    });
  });
};
